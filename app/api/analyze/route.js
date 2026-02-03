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
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: `
Analise o perfil desta URL:
${url}

Responda em português, de forma clara e estruturada:

1. Nicho identificado
2. Tipo de público
3. Pontos fortes
4. Pontos fracos
5. Sugestões práticas
6. Bio otimizada
7. Ideias de conteúdo
`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "Erro OpenAI" },
        { status: 500 }
      );
    }

    // 🔑 EXTRAÇÃO CORRETA DO TEXTO
    const text =
      data.output?.[0]?.content?.[0]?.text ||
      data.output_text ||
      "⚠️ Resposta vazia da OpenAI";

    return Response.json({ result: text });

  } catch (err) {
    return Response.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
