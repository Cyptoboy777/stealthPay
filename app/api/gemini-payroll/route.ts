import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

type SplitPayload = {
  main?: number;
  savings?: number;
  yield?: number;
};

function withTimeout<T>(promise: Promise<T>, milliseconds: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini request timed out')), milliseconds);
    }),
  ]);
}

function fallbackAnswer(question: string, salary: number, splits: SplitPayload) {
  const main = splits.main ?? 55;
  const savings = splits.savings ?? 25;
  const yieldVault = splits.yield ?? 20;
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('privacy') || lowerQuestion.includes('proof')) {
    return 'Use selective disclosure for aggregate conditions only: budget sufficiency, tax band, and routing policy. Do not reveal wallet-level salary rows unless an auditor challenge requires it.';
  }

  if (lowerQuestion.includes('budget') || lowerQuestion.includes('liquid')) {
    return `For a $${salary.toLocaleString()} cycle, the current ${main}% Main Wallet route keeps about $${Math.round(
      (salary * main) / 100,
    ).toLocaleString()} liquid. That is a balanced setup if rent, debt, and near-term expenses are covered there.`;
  }

  return `Your current split is ${main}% main, ${savings}% savings, and ${yieldVault}% yield. Keep yield allocation limited to surplus funds and generate a routing proof before claim execution.`;
}

export async function POST(request: Request) {
  let body: {
    question?: string;
    salary?: number;
    splits?: SplitPayload;
  } = {};

  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const question = body.question?.slice(0, 600).trim() || 'Review my encrypted payroll split.';
  const salary = Number(body.salary || 5240);
  const splits = body.splits || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return NextResponse.json({ answer: fallbackAnswer(question, salary, splits), source: 'fallback' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are StealthPay's Gemini AI Payroll Assistant. Answer in 2 concise sentences. Avoid legal or financial guarantees. Context: salary ${salary} USDC, split policy ${JSON.stringify(
                  splits,
                )}. User question: ${question}`,
              },
            ],
          },
        ],
        config: {
          temperature: 0.45,
          maxOutputTokens: 160,
        },
      }),
      5000,
    );

    return NextResponse.json({
      answer: response.text || fallbackAnswer(question, salary, splits),
      source: response.text ? 'gemini' : 'fallback',
    });
  } catch (error) {
    console.error('Gemini payroll assistant failed', error);
    return NextResponse.json({ answer: fallbackAnswer(question, salary, splits), source: 'fallback' });
  }
}
