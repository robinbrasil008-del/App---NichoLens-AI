import { openai } from "../../../lib/openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um consultor especialista em redes sociais e nichos informais."
        },
        { role: "user", content: message }
      ]
    });

    return Response.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erro no chat" }, { status: 500 });
  }
}
