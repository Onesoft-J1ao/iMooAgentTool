export interface FeatureMatch {
  featurePath: string;
  featureName: string;
  explanation: string;
  confidence: number;
}

export interface SearchResult {
  matches: Array<{
    path: string;
    name: string;
    description: string;
    confidence: number;
    explanation: string;
  }>;
  aiPowered: boolean;
}

export async function searchFeatures(query: string): Promise<SearchResult> {
  return window.api.agent.search(query);
}

export async function getAllFeatures() {
  return window.api.agent.getAllFeatures();
}

export async function getRandomTip(): Promise<string> {
  return window.api.agent.getRandomTip();
}

export async function getAgentConfig(): Promise<{ agentApiUrl: string; agentApiKey: string; agentModel: string; agentEnabled: boolean }> {
  return window.api.agent.getConfig();
}

export async function setAgentConfig(config: { agentApiUrl?: string; agentApiKey?: string; agentModel?: string; agentEnabled?: boolean }): Promise<void> {
  return window.api.agent.setConfig(config);
}

export async function testAgentConnection(): Promise<{ success: boolean; message: string }> {
  return window.api.agent.testConnection();
}

export async function chatWithAI(messages: Array<{role: string; content: string}>): Promise<{ reply: string }> {
  return window.api.agent.chat(messages);
}
