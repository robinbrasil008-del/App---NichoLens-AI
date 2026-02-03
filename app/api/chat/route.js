import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em marketing digital e crescimento em redes sociais.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
