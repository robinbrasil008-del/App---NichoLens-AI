import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Você é um consultor especialista em redes sociais."
        },
        { role: "user", content: message }
      ]
    });

    return Response.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("ERRO CHAT:", error);

    return Response.json(
      { error: "Erro no chat", details: error.message },
      { status: 500 }
    );
  }
}
