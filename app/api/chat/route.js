import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return Response.json(
      { error: "Erro ao conversar com a IA" },
      { status: 500 }
    );
  }
}
