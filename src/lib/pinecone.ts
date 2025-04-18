import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

// create pinecone client
export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

// process a pdf into vector database
export async function loadS3IntoPinecone(fileKey: string) {
  try {
    // getting pdf from s3
    console.log("downloading s3 into file system");
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
      throw new Error("could not downlaod from s3");
    }

    // extract text
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // splitting and segmenting pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // vectorise and embed documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // upload to pinecone
    console.log("inserting vectors into pinecone");
    const client = getPineconeClient();
    const pineconeIndex = client.Index("notefuse");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    await namespace.upsert(vectors);

    return documents[0];
  } catch (error) {
    console.error("error loading document from s3 to pinecone", error);
    throw error;
  }
}

// generates embeddings for a document
async function embedDocument(doc: Document) {
  try {
    // get embeddings and create unique hash
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    // returns embeddings with metadata
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.error("error embedding document", error);
    throw error;
  }
}

// converts string to bytes and slices to specified limit, then converts back
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

// preprocesses document
async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  // cleans up text
  pageContent = pageContent.replace(/\n/g, "");

  // split text into meaningful chunks, truncating text to prevent exceeding size limits
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
