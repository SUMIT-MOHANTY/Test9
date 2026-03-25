/**
 * Secure OpenAI API integration service
 */
const axios = require('axios');
const rateLimit = require('axios-rate-limit');

class AIService {
  constructor() {
    // Create rate-limited axios instance
    this.client = rateLimit(axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      timeout: 30000 // 30 second timeout
    }), { maxRequests: 5, perMilliseconds: 1000 }); // 5 requests per second max

    // Verify API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
    }
  }

  /**
   * Validate and sanitize prompt input
   * @param {string} prompt - User input prompt
   * @returns {string} Sanitized prompt
   */
  sanitizePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt format');
    }

    // Remove potentially harmful characters
    return prompt.trim().replace(/[^\w\s.,?!;:()\[\]{}'"\/\\-]/g, '');
  }

  /**
   * Generate text using OpenAI API with secure error handling
   * @param {string} prompt - User input prompt
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated text result
   */
  async generateText(prompt, options = {}) {
    try {
      // Sanitize input
      const sanitizedPrompt = this.sanitizePrompt(prompt);

      // Set defaults for secure operation
      const safeOptions = {
        model: options.model || 'gpt-3.5-turbo',
        max_tokens: Math.min(options.max_tokens || 100, 500), // Limit token usage
        temperature: Math.min(Math.max(options.temperature || 0.7, 0), 1), // Ensure temperature is between 0-1
        top_p: Math.min(Math.max(options.top_p || 1, 0), 1),
        frequency_penalty: Math.min(Math.max(options.frequency_penalty || 0, 0), 2),
        presence_penalty: Math.min(Math.max(options.presence_penalty || 0, 0), 2)
      };

      const response = await this.client.post('/chat/completions', {
        model: safeOptions.model,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant providing information about GenAI products."
          },
          {
            role: "user",
            content: sanitizedPrompt
          }
        ],
        max_tokens: safeOptions.max_tokens,
        temperature: safeOptions.temperature,
        top_p: safeOptions.top_p,
        frequency_penalty: safeOptions.frequency_penalty,
        presence_penalty: safeOptions.presence_penalty
      });

      return {
        text: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      // Handle specific API errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error(`OpenAI API error (${status}):`, data);

        // Handle specific error cases
        if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status === 400) {
          throw new Error('Invalid request to AI service.');
        } else {
          throw new Error('Error communicating with AI service.');
        }
      }

      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI response.');
    }
  }
}

module.exports = new AIService();
