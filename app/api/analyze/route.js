import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  const { url } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Você é um especialista em redes sociais." },
      { role: "user", content: `Analise este perfil: ${url}` }
    ]
  });

  return Response.json({
    result: completion.choices[0].message.content
  });
}
