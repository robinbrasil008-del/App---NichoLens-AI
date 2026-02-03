import OpenAI from "openai";

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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
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

Responda em português.

1. Identifique o NICHO do perfil
2. Avalie se está adequado para nicho informal
3. Liste pontos fortes
4. Liste pontos fracos
5. Sugira melhorias práticas
6. Crie uma BIO otimizada
7. Sugira estratégia de conteúdo
`
        }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;

    return Response.json({ result: text });

  } catch (error) {
    console.error("ERRO OPENAI:", error);

    return Response.json(
      {
        error: "Erro ao gerar análise",
        details: error.message
      },
      { status: 500 }
    );
  }
}
