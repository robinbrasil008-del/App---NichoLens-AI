export const runtime = "nodejs";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;

  return Response.json({
    hasKey: Boolean(key),
    keyLength: key ? key.length : 0,
    keyStart: key ? key.slice(0, 7) : null,
    keyEnd: key ? key.slice(-4) : null
  });
}
