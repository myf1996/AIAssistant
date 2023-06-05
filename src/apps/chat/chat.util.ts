import { systemConfig } from 'src/config/system.config';
import { User } from '../user/entities/user.entity';
import { ChatResponseDto } from './dto/chat.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { ChatHistory } from './dto/history.dto';
import { Role } from './dto/role.enum';

const { Configuration, OpenAIApi } = require('openai');

const OPEN_AI_SECRET_KEY =
  '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';
const configuration = new Configuration({
  apiKey: systemConfig.openai.api_key,
});
const openaiApi = new OpenAIApi(configuration);

export const openAIChat = async (
  user: User,
  chatHistory: ChatHistory[],
  message: string,
  category: string,
) => {
  const isAskingIfChatGpt = message.toLowerCase().includes('chatgpt');
  let prompt = '';
  if (user.name) {
    prompt += ` Hi I'm ${user.name}, `;
  }
  prompt += `${message}`;
  if (category) {
    prompt + ` , Preffered ${category} related topic/subject`
  }
  if (isAskingIfChatGpt) {
    prompt += ` I'm just a simple AI assistant designed to help you with your ${user.role} needs. How can I assist you today?`;
  }

  chatHistory.push({
    role: Role.user,
    content: prompt,
  });
  // Call OpenAI API to generate response
  const chatArgs = {
    model: 'gpt-3.5-turbo', //
    messages: chatHistory,
    max_tokens: 1024,
    temperature: 0.5,
    n: 1,
    // stop: ['\n']
  };
  try {
    const result = await openaiApi.createChatCompletion(chatArgs);
    return { response: result.data, prompt: prompt };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
};
