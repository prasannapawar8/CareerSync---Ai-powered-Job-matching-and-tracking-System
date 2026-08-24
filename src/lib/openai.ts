import OpenAI from 'openai';

// Configure the OpenAI client to point to Groq's API
// Groq provides blazing fast inference for OSS models (Llama 3, Mixtral, etc.)
// and is fully compatible with the OpenAI SDK.
export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '',
  baseURL: process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined,
});
