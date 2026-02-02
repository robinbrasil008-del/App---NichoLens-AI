import { openai } from "../../../lib/openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const url = body?.url;

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
2. Diga se o perfil está adequado para um nicho INFORMAL
3. Liste pontos fortes
4. Liste pontos fracos
5. Sugira melhorias práticas
6. Crie uma BIO otimizada
7. Sugira uma estratégia de conteúdo
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const text = completion.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Resposta vazia da OpenAI");
    }

    return Response.json({ result: text });

  } catch (error) {
    console.error("ERRO API ANALYZE:", error);

    return Response.json(
      {
        error: "Falha ao gerar análise",
        details: error.message
      },
      { status: 500 }
    );
  }
}
