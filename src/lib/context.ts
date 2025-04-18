import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { getPineconeClient } from "./pinecone";

// queries vector database to find text chunks that match a query
export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    // access the namespace in index
    const client = getPineconeClient()
    const pineconeIndex = client.index("notefuse");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    // vector similarity search for top matches
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

// retrieves relevant context for the ai
export async function getContext(query: string, fileKey: string) {
  // convert user query to embedding and get matches
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

  // extract text from matches
  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  // combine chunks and limits to 3000 characters
  return docs.join("\n").substring(0, 3000);
}
