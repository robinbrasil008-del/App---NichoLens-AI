import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const { url } = await req.json();

    const prompt = `
Você é um especialista em redes sociais.

Analise o perfil a partir desta URL:
${url}

1. Identifique automaticamente o NICHO do perfil
2. Avalie se o perfil está adequado para um nicho INFORMAL
3. Liste pontos fortes
4. Liste pontos fracos
5. Gere sugestões práticas de melhoria
6. Sugira uma BIO otimizada
7. Sugira estratégia de conteúdo
8. Use linguagem clara e direta
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    return Response.json({
      result: response.choices[0].message.content
    });

  } catch (error) {
    return Response.json({ error: "Erro ao analisar perfil" }, { status: 500 });
  }
}
