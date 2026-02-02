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

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
Você é um especialista em redes sociais.

Analise o perfil a partir desta URL:
${url}

Responda em português.

1. Identifique automaticamente o NICHO do perfil
2. Avalie se o perfil é adequado para um nicho informal
3. Liste pontos fortes
4. Liste pontos fracos
5. Sugira melhorias práticas
6. Crie uma BIO otimizada
7. Sugira uma estratégia de conteúdo
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    const text =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text;

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
