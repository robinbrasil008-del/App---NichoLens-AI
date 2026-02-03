export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { url } = await req.json();

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
          input: `Analise este perfil e diga o nicho e sugestões: ${url}`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return Response.json(
        { error: data.error?.message || "Erro OpenAI" },
        { status: 500 }
      );
    }

    return Response.json({
      result: data.output_text
    });

  } catch (e) {
    return Response.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
