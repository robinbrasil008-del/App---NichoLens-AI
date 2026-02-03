import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem vazia" },
        { status: 400 }
      );
    }

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
          temperature: 0.6,
          messages: [
            {
              role: "system",
              content: `
Você é o Pedro, um especialista em marketing digital e crescimento de perfis em redes sociais.

REGRAS OBRIGATÓRIAS:
- Organize TODA resposta em blocos
- Use emojis nos títulos
- Use listas curtas
- Pule linhas entre seções
- Nunca escreva texto longo em parágrafo único
- Pense sempre em leitura no celular

MODELO DE RESPOSTA:

🎯 Nicho Identificado
• item
• item

👥 Público-Alvo
• item
• item

🚀 Sugestões Práticas
1. ação
2. ação
3. ação
              `,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data },
        { status: 500 }
      );
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
