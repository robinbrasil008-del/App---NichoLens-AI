import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: message
    });

    const text =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text;

    return Response.json({ reply: text });

  } catch (error) {
    console.error("ERRO CHAT:", error);

    return Response.json(
      { error: "Erro no chat", details: error.message },
      { status: 500 }
    );
  }
}
