import axios from 'axios';
import { logger } from '../utils/logger';

export interface AIResponse {
  content: string;
  tokensUsed?: number;
  model: string;
  processingTime: number;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  tokensUsed?: number;
}

export class VertexAIProvider {
  private projectId: string;
  private location: string;
  private model: string;
  private accessToken?: string;

  constructor() {
    this.projectId = process.env.VERTEX_PROJECT || '';
    this.location = process.env.VERTEX_LOCATION || 'us-central1';
    this.model = process.env.VERTEX_MODEL || 'gemini-2.0-flash-exp';
  }

  private async getAccessToken(): Promise<string> {
    // In production, use Google Auth libraries
    // For demo purposes, we'll use a mock token
    if (process.env.USE_MOCK_AI === 'true') {
      return 'mock-vertex-token';
    }
    
    // Real implementation would use:
    // const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    // const client = await auth.getClient();
    // const token = await client.getAccessToken();
    // return token.token!;
    
    throw new Error('Vertex AI credentials not configured. Set USE_MOCK_AI=true for demo mode.');
  }

  async generateText(prompt: string, context?: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      if (process.env.USE_MOCK_AI === 'true') {
        return this.mockResponse(prompt, startTime);
      }

      const accessToken = await this.getAccessToken();
      const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model}:generateContent`;

      const requestBody = {
        contents: [{
          role: 'user',
          parts: [{
            text: context ? `Context: ${context}\n\nUser: ${prompt}` : prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      const tokensUsed = response.data.usageMetadata?.totalTokenCount;

      return {
        content,
        tokensUsed,
        model: this.model,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      logger.error('Vertex AI API error:', error);
      return this.mockResponse(prompt, startTime);
    }
  }

  private mockResponse(prompt: string, startTime: number): AIResponse {
    const mockResponses = [
      "Based on your profile and interests, I'd recommend exploring software development roles, particularly in web development or data science. These fields align well with your technical skills and offer excellent growth opportunities.",
      "Your personality traits suggest you'd excel in collaborative environments. Consider roles in product management, UX design, or technical consulting where you can leverage both your technical knowledge and people skills.",
      "Given your educational background and interests, I see great potential in emerging technologies like AI/ML, cloud computing, or cybersecurity. These are high-growth areas with strong job prospects.",
      "Your skills profile indicates you'd be well-suited for full-stack development, DevOps engineering, or data analysis roles. I'd recommend focusing on building projects that showcase these capabilities."
    ];

    return {
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      model: 'mock-gemini-2b',
      processingTime: Date.now() - startTime
    };
  }
}

export class HuggingFaceProvider {
  private token: string;
  private model: string;
  private embeddingModel: string;

  constructor() {
    this.token = process.env.HF_TOKEN || '';
    this.model = process.env.HF_MODEL || 'microsoft/DialoGPT-medium';
    this.embeddingModel = process.env.HF_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
  }

  async generateText(prompt: string, context?: string): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      if (process.env.USE_MOCK_AI === 'true' || !this.token) {
        return this.mockResponse(prompt, startTime);
      }

      const url = `https://api-inference.huggingface.co/models/${this.model}`;
      const input = context ? `Context: ${context}\nUser: ${prompt}` : prompt;

      const response = await axios.post(url, {
        inputs: input,
        parameters: {
          max_length: 512,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        },
        options: {
          use_cache: false,
          wait_for_model: true
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const content = response.data[0]?.generated_text || 'No response generated';

      return {
        content: content.trim(),
        model: this.model,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      logger.error('Hugging Face API error:', error);
      return this.mockResponse(prompt, startTime);
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    try {
      if (process.env.USE_MOCK_EMBEDDINGS === 'true' || !this.token) {
        return this.mockEmbedding(text);
      }

      const url = `https://api-inference.huggingface.co/models/${this.embeddingModel}`;

      const response = await axios.post(url, {
        inputs: text,
        options: {
          wait_for_model: true
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return {
        embedding: response.data,
        model: this.embeddingModel
      };

    } catch (error) {
      logger.error('Hugging Face Embedding API error:', error);
      return this.mockEmbedding(text);
    }
  }

  private mockResponse(prompt: string, startTime: number): AIResponse {
    const mockResponses = [
      "That's an interesting question! Based on current industry trends, I'd suggest focusing on developing skills in cloud technologies, AI/ML, and modern web frameworks. These areas are seeing significant growth and offer excellent career opportunities.",
      "Great point! For someone with your background, I'd recommend exploring roles in software engineering, data science, or product management. Each of these paths offers unique opportunities for growth and impact.",
      "I understand your concern. The tech industry is constantly evolving, but that also means there are always new opportunities emerging. Consider specializing in areas like cybersecurity, DevOps, or mobile development.",
      "That's a thoughtful question. Based on your interests, you might want to look into full-stack development, cloud architecture, or data engineering. These roles are in high demand and offer good work-life balance."
    ];

    return {
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      model: 'mock-hf-model',
      processingTime: Date.now() - startTime
    };
  }

  private mockEmbedding(text: string): EmbeddingResponse {
    // Generate a mock 384-dimensional embedding (typical for all-MiniLM-L6-v2)
    const embedding = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
    
    return {
      embedding,
      model: 'mock-embedding-model'
    };
  }
}

export class AIService {
  private vertexProvider: VertexAIProvider;
  private hfProvider: HuggingFaceProvider;
  private defaultProvider: 'vertex' | 'huggingface';

  constructor() {
    this.vertexProvider = new VertexAIProvider();
    this.hfProvider = new HuggingFaceProvider();
    this.defaultProvider = process.env.DEFAULT_AI_PROVIDER as 'vertex' | 'huggingface' || 'huggingface';
  }

  async generateResponse(prompt: string, context?: string, provider?: 'vertex' | 'huggingface'): Promise<AIResponse> {
    const selectedProvider = provider || this.defaultProvider;
    
    try {
      if (selectedProvider === 'vertex') {
        return await this.vertexProvider.generateText(prompt, context);
      } else {
        return await this.hfProvider.generateText(prompt, context);
      }
    } catch (error) {
      logger.error(`AI Service error with ${selectedProvider}:`, error);
      // Fallback to the other provider
      const fallbackProvider = selectedProvider === 'vertex' ? 'huggingface' : 'vertex';
      logger.info(`Falling back to ${fallbackProvider}`);
      
      if (fallbackProvider === 'vertex') {
        return await this.vertexProvider.generateText(prompt, context);
      } else {
        return await this.hfProvider.generateText(prompt, context);
      }
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    return await this.hfProvider.generateEmbedding(text);
  }
}

export const aiService = new AIService();
