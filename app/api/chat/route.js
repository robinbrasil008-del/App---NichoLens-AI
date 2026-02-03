export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message } = await req.json();

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
                "Você é um consultor especialista em redes sociais."
            },
            { role: "user", content: message }
          ]
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

    return Response.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    return Response.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
