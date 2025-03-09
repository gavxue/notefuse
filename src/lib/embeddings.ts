// import { OpenAIApi, Configuration } from "openai-edge";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function getEmbeddings(text: string) {
//   try {
//     const response = await openai.createEmbedding({
//       model: "text-embedding-3-small",
//       input: text.replace(/\n/g, " "),
//       dimension:
//     });
//     const result = await response.json();
//     return result.data[0].embedding as number[];
//   } catch (error) {
//     console.log("error calling openai embeddings api", error);
//     throw error;
//   }
// }

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export async function getEmbeddings(text: string) {
  try {
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
