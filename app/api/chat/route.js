import { openai } from "@/lib/openai";

export async function POST(req) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você é um consultor de redes sociais especialista em nicho informal." },
      { role: "user", content: message }
    ]
  });

  return Response.json({
    reply: response.choices[0].message.content
  });
}
