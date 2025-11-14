import * as React from 'react';
import {
  Chatbot,
  ChatbotDisplayMode,
  ChatbotHeader,
  ChatbotHeaderActions,
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotContent,
  ChatbotFooter,
  ChatbotWelcomePrompt,
  MessageBox,
  Message
} from '@patternfly/chatbot';
import {
  Button,
  Label,
  TextArea,
  ActionList,
  ActionListItem,
  Spinner
} from '@patternfly/react-core';
import { TimesIcon, PaperPlaneIcon } from '@patternfly/react-icons';
import { useLocation } from 'react-router-dom';
import { useAIContext } from './AIContext';
import { useVersion } from '@app/context/VersionContext';
import { useComments } from '@app/context/CommentContext';

export const AIChatPanel: React.FunctionComponent = () => {
  const { messages, isLoading, sendMessage, toggleChatbot } = useAIContext();
  const { currentVersion } = useVersion();
  const { threads } = useComments();
  const location = useLocation();
  const [inputValue, setInputValue] = React.useState('');

  // Count comments in current version
  const commentCount = React.useMemo(() => {
    return threads.filter(t => t.version === currentVersion).reduce((acc, t) => acc + t.comments.length, 0);
  }, [threads, currentVersion]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue, {
        threads,
        version: currentVersion || 'unknown',
        route: location.pathname
      });
      setInputValue('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '400px',
        maxHeight: '600px',
        zIndex: 2000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Chatbot displayMode={ChatbotDisplayMode.default}>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <ChatbotHeaderTitle>
            🤖 AI Feedback Assistant
          </ChatbotHeaderTitle>
          {currentVersion && commentCount > 0 && (
            <span style={{ marginLeft: '0.5rem' }}>
              <Label color="blue" isCompact>
                Version {currentVersion}
              </Label>
              <Label color="grey" isCompact style={{ marginLeft: '0.25rem' }}>
                {commentCount} comments
              </Label>
            </span>
          )}
        </ChatbotHeaderMain>
        <ChatbotHeaderActions>
          <Button
            variant="plain"
            onClick={toggleChatbot}
            aria-label="Close chatbot"
            icon={<TimesIcon />}
          />
        </ChatbotHeaderActions>
      </ChatbotHeader>

      <ChatbotContent>
        <MessageBox>
          {messages.length === 0 ? (
            <ChatbotWelcomePrompt
              title="Welcome to AI Feedback Assistant"
              description="Ask me about comments across your prototype. I can help you:"
            >
              <ActionList>
                <ActionListItem>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => handleQuickAction('What feedback was left in the last week?')}
                  >
                    Summarize recent feedback
                  </Button>
                </ActionListItem>
                <ActionListItem>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => handleQuickAction('Show me all accessibility issues')}
                  >
                    Find accessibility issues
                  </Button>
                </ActionListItem>
                <ActionListItem>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => handleQuickAction('What are the main navigation problems?')}
                  >
                    Identify navigation problems
                  </Button>
                </ActionListItem>
                <ActionListItem>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => handleQuickAction('Which page has the most comments?')}
                  >
                    Analyze comment distribution
                  </Button>
                </ActionListItem>
              </ActionList>
            </ChatbotWelcomePrompt>
          ) : (
            <>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  name={msg.role === 'user' ? 'You' : 'AI Assistant'}
                  role={msg.role === 'user' ? 'user' : 'bot'}
                  avatar={msg.role === 'user' ? '👤' : '🤖'}
                  content={msg.content}
                  timestamp={new Date(msg.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                />
              ))}
              {isLoading && (
                <Message 
                  name="AI Assistant" 
                  role="bot" 
                  avatar="🤖"
                  content={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Spinner size="md" /> 
                      <span>Analyzing comments...</span>
                    </div>
                  }
                />
              )}
            </>
          )}
        </MessageBox>
      </ChatbotContent>

      <ChatbotFooter>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          {/* Quick action buttons */}
          {messages.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="sm"
                isDisabled={isLoading}
                onClick={() => handleQuickAction('What comments were left in the last 7 days?')}
              >
                Last 7 days
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isDisabled={isLoading}
                onClick={() => handleQuickAction('Show comments on this page only')}
              >
                This page only
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isDisabled={isLoading}
                onClick={() => handleQuickAction('Find all accessibility issues')}
              >
                Accessibility
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isDisabled={isLoading}
                onClick={() => handleQuickAction('Show high priority items')}
              >
                High priority
              </Button>
            </div>
          )}

          {/* Input field */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <TextArea
              id="ai-chat-input"
              value={inputValue}
              onChange={(_event, value) => setInputValue(value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about feedback..."
              aria-label="Message input"
              rows={2}
              style={{ flex: 1 }}
              isDisabled={isLoading}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              isDisabled={!inputValue.trim() || isLoading}
              icon={<PaperPlaneIcon />}
              aria-label="Send message"
            />
          </div>
        </div>
      </ChatbotFooter>
      </Chatbot>
    </div>
  );
};

