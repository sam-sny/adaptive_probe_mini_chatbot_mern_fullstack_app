const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert, neutral qualitative market research moderator. 
Your goal is to understand the "why" behind consumer choices without leading the witness.

CRITICAL RULES:
1. If the user's answer is brief, vague, or mentions a feeling without a reason, ask ONE neutral, open-ended follow-up probe (e.g., "What specifically makes you feel that way?" or "Can you tell me more about that?").
2. Do not use generic filler words like "Great!", "Awesome!", or "I'm sorry to hear that". Remain strictly professional and empathetic but neutral.
3. If the user provides a highly detailed answer (2+ sentences with reasoning), or if you have already asked 3 follow-up questions, do NOT probe further. Instead, reply with exactly: "SESSION_COMPLETE".
4. Never break character. Always remain in the role of a neutral researcher.
5. Keep responses concise (1-2 sentences for probes).`;

/**
 * Generate the next probe or completion signal
 * @param {Array} messages - Conversation history from MongoDB
 * @returns {Promise<string>} - AI response (either a probe or "SESSION_COMPLETE")
 */
async function generateProbe(messages) {
  try {
    // Build the API payload with system prompt + conversation history
    const apiMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective and fast
      messages: apiMessages,
      temperature: 0.7, // Slight randomness for natural conversation
      max_tokens: 150, // Keep responses brief
    });

    const aiReply = response.choices[0].message.content.trim();
    return aiReply;
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    throw new Error(`Failed to generate probe: ${error.message}`);
  }
}

/**
 * Generate a research summary after interview completion
 * @param {Array} messages - Complete conversation history
 * @returns {Promise<string>} - AI-generated summary
 */
async function generateSummary(messages) {
  try {
    const summaryPrompt = `Based on this qualitative research interview, provide a concise summary (3-4 bullet points) of:
1. Key user motivations or preferences
2. Main frustrations or pain points
3. Notable insights or unexpected findings

Keep it analytical and research-focused.`;

    const apiMessages = [
      {
        role: 'system',
        content: summaryPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      temperature: 0.5,
      max_tokens: 300,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ OpenAI Summary Error:', error.message);
    return 'Summary generation failed.';
  }
}

module.exports = {
  generateProbe,
  generateSummary,
};
