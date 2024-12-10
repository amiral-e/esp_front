import { NextResponse } from "next/server";

const SAMPLE_RESPONSES = [
  "Je suis ravi de pouvoir vous aider aujourd'hui !",
  "C'est une excellente question.",
  "Laissez-moi réfléchir à cela...",
  "Voici une réponse détaillée à votre demande.",
  "Je comprends votre point de vue.",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const randomResponse =
      SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];

    return NextResponse.json({
      role: "assistant",
      content: randomResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
