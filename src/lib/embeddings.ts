import OpenAI from "openai";

// create openai client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

// transfrosm text into a mult-dimension vector
export async function getEmbeddings(text: string) {
  try {
    // use text embedding model to create embeddings
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " "),
      dimensions: 1024,
    });
    
    return embedding.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
