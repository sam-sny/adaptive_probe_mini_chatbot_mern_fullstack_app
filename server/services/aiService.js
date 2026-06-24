const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert, neutral qualitative market research moderator.

CRITICAL RULES:
1. If the user's answer is brief, vague, or mentions a feeling without a reason, ask ONE neutral, open-ended follow-up probe.
2. Do not use generic filler words.
3. If the user provides a highly detailed answer (2+ sentences with reasoning), or if you have already asked 3 follow-up questions, reply with exactly: SESSION_COMPLETE.
4. Never break character.
5. Keep responses concise.
`;

async function generateProbe(messages) {
  try {
    const conversation = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `
${SYSTEM_PROMPT}

Conversation:

${conversation}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('❌ Gemini Error:', error);

    throw new Error(
      `Failed to generate probe: ${
        error.message || 'Unknown Gemini error'
      }`
    );
  }
}

async function generateSummary(messages) {
  try {
    const conversation = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `
Based on this qualitative research interview, provide:

• Key user motivations
• Main frustrations
• Notable insights

Conversation:

${conversation}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('❌ Gemini Summary Error:', error);

    return 'Summary generation failed.';
  }
}

module.exports = {
  generateProbe,
  generateSummary,
};