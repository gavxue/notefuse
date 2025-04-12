import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("notefuse");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    // get top matches from embeddings
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  // filter out matches with required score
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  // if none are above score, return highest score
  if (qualifyingDocs.length === 0 && matches.length > 0) {
    const highestScoreMatch = matches.reduce((prev, current) =>
      (prev.score ?? 0) > (current.score ?? 0) ? prev : current
    );
    qualifyingDocs.push(highestScoreMatch);
  }

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  return docs.join("\n").substring(0, 3000);
}
