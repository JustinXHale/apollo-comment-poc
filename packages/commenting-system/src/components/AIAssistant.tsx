import * as React from 'react';
import { ChatbotToggle } from '@patternfly/chatbot';
import { useAIContext } from '../contexts/AIContext';
import { AIChatPanel } from './AIChatPanel';

export const AIAssistant: React.FunctionComponent = () => {
  const { isChatbotVisible, toggleChatbot } = useAIContext();

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 2000
        }}
      >
        <ChatbotToggle
          id="ai-chatbot-toggle"
          isChatbotVisible={isChatbotVisible}
          onToggleChatbot={toggleChatbot}
          toggleButtonLabel="AI Assistant"
          tooltipLabel="Get AI help analyzing feedback"
          style={{
            backgroundColor: '#C9190B',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            color: 'white'
          }}
        />
      </div>
      {isChatbotVisible && <AIChatPanel />}
    </>
  );
};

