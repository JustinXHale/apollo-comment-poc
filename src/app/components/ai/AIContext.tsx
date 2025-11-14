import * as React from 'react';

export interface AIMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface AIContextType {
  isChatbotVisible: boolean;
  messages: AIMessage[];
  isLoading: boolean;
  toggleChatbot: () => void;
  sendMessage: (content: string, commentContext?: { threads: any[]; version: string; route?: string }) => Promise<void>;
  clearHistory: () => void;
}

const AIContext = React.createContext<AIContextType | undefined>(undefined);

const STORAGE_KEY = 'apollo-ai-chat-history';
const VISIBILITY_KEY = 'apollo-ai-chatbot-visible';

export const AIProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage
  const [isChatbotVisible, setIsChatbotVisible] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(VISIBILITY_KEY);
      return stored === 'true';
    } catch (error) {
      return false;
    }
  });

  const [messages, setMessages] = React.useState<AIMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Failed to load AI chat history from localStorage:', error);
      return [];
    }
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Persist visibility to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(VISIBILITY_KEY, String(isChatbotVisible));
    } catch (error) {
      console.error('Failed to save chatbot visibility to localStorage:', error);
    }
  }, [isChatbotVisible]);

  // Persist messages to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save AI chat history to localStorage:', error);
    }
  }, [messages]);

  const toggleChatbot = React.useCallback(() => {
    setIsChatbotVisible(prev => !prev);
  }, []);

  const sendMessage = React.useCallback(async (content: string, commentContext?: { threads: any[]; version: string; route?: string }) => {
    if (!content.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the Vercel serverless function
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: content.trim(),
          threads: commentContext?.threads || [],
          version: commentContext?.version || 'unknown',
          route: commentContext?.route
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: AIMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: data.message || 'No response received.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AIMessage = {
        id: `bot-error-${Date.now()}`,
        role: 'bot',
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}` 
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = React.useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear chat history from localStorage:', error);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      isChatbotVisible,
      messages,
      isLoading,
      toggleChatbot,
      sendMessage,
      clearHistory
    }),
    [isChatbotVisible, messages, isLoading, toggleChatbot, sendMessage, clearHistory]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAIContext = (): AIContextType => {
  const context = React.useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
};

