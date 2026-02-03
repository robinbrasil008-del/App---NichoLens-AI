export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json(
        { error: "URL não informada" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em redes sociais e análise de nichos."
            },
            {
              role: "user",
              content: `
Analise o perfil a partir desta URL:
${url}

Responda em português:

1. Identifique o NICHO do perfil
2. Avalie se é adequado para nicho informal
3. Pontos fortes
4. Pontos fracos
5. Sugestões práticas
6. BIO otimizada
7. Estratégia de conteúdo
`
            }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENAI ERROR:", data);
      return Response.json(
        { error: data.error?.message || "Erro OpenAI" },
        { status: 500 }
      );
    }

    return Response.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return Response.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
