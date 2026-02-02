import { openai } from "../../../lib/openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
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
