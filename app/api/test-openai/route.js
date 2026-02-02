import OpenAI from "openai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: "Responda apenas: OK FUNCIONANDO"
    });

    return Response.json({
      success: true,
      output: response.output_text
    });

  } catch (error) {
    console.error("TEST OPENAI ERROR:", error);

    return Response.json(
      {
        success: false,
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
