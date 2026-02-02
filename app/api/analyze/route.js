import { openai } from "../../../lib/openai";

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

    const prompt = `
Você é um especialista em redes sociais.

Analise o perfil a partir desta URL:
${url}

Responda em português.

1. Identifique automaticamente o NICHO do perfil
2. Diga se o perfil é adequado para um nicho informal
3. Liste pontos fortes
4. Liste pontos fracos
5. Sugira melhorias práticas
6. Crie uma BIO otimizada
7. Sugira uma estratégia de conteúdo
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    const text =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text;

    if (!text) {
      throw new Error("Resposta vazia da OpenAI");
    }

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
