export type LLMAgent = {
  chat(text: string): Promise<string>;
};
