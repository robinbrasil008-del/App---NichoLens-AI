export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json(
        { error: "URL vazia" },
        { status: 400 }
      );
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Você é um especialista em análise de perfis de redes sociais."
            },
            {
              role: "user",
              content: `Analise este perfil e diga o nicho e sugestões: ${url}`
            }
          ]
        })
      }
    );

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return Response.json(
        { error: data.error?.message || "Erro OpenAI" },
        { status: 500 }
      );
    }

    return Response.json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    return Response.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
