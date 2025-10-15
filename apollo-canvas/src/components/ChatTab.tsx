import React, { useState } from 'react';
import {
  Stack,
  StackItem,
  Title,
  Card,
  CardBody,
  TextInput,
  Button,
  Flex,
  FlexItem,
  Divider,
} from '@patternfly/react-core';
import { 
  ICursorIcon, 
  AngleUpIcon, 
  PlusIcon,
  SortAmountDownIcon,
  FilterIcon,
  SpinnerIcon
} from '@patternfly/react-icons';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatTabProps {
  isSelectMode: boolean;
  setIsSelectMode: (value: boolean) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ isSelectMode, setIsSelectMode }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant for Apollo Canvas. I can help you edit and improve your prototype. What would you like to work on?',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you want to: "${message}". I'll help you implement this change to your prototype.`,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, userMessage, assistantMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };



  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '16px'
    }}>
      <Stack hasGutter style={{ height: '100%' }}>
        <StackItem>
          <Title headingLevel="h2" size="lg">
            Chat
          </Title>
        </StackItem>
        
        <StackItem>
          <Button
            variant={isSelectMode ? "primary" : "secondary"}
            icon={<ICursorIcon />}
            onClick={() => setIsSelectMode(!isSelectMode)}
            style={{ marginBottom: '16px' }}
          >
            {isSelectMode ? 'Exit Selection Mode' : 'Select Element'}
          </Button>
        </StackItem>

        <StackItem isFilled>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardBody style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <Stack hasGutter>
                {chatHistory.map((msg) => (
                  <StackItem key={msg.id}>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <small style={{ 
                          color: 'var(--pf-v6-global--Color--200)',
                          fontWeight: msg.type === 'user' ? 600 : 400
                        }}>
                          {msg.type === 'user' ? 'You' : 'AI Assistant'} • {formatTime(msg.timestamp)}
                        </small>
                      </FlexItem>
                      <FlexItem>
                        <p style={{ 
                          marginTop: '4px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: msg.type === 'user' 
                            ? 'var(--pf-v6-global--primary-color--100)' 
                            : 'var(--pf-v6-global--BackgroundColor--200)',
                          alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          margin: 0
                        }}>
                          {msg.content}
                        </p>
                      </FlexItem>
                    </Flex>
                    {msg.id !== chatHistory[chatHistory.length - 1].id && <Divider />}
                  </StackItem>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </StackItem>

        <StackItem>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: 'var(--pf-v6-global--BackgroundColor--300)',
            borderRadius: '24px',
            border: '1px solid var(--pf-v6-global--BorderColor--200)'
          }}>
            {/* Plus button */}
            <Button
              variant="plain"
              icon={<PlusIcon />}
              style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--pf-v6-global--BackgroundColor--100)',
                border: '1px solid var(--pf-v6-global--BorderColor--200)'
              }}
              aria-label="Add attachment"
            />

            {/* Main input area */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--pf-v6-global--BackgroundColor--400)',
              borderRadius: '20px',
              padding: '8px 16px',
              gap: '8px'
            }}>
              <TextInput
                value={message}
                onChange={(_, value) => setMessage(value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask for changes"
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontSize: '14px'
                }}
                aria-label="Chat input"
              />
            </div>

            {/* Send button */}
            <Button
              variant="primary"
              onClick={handleSendMessage}
              isDisabled={!message.trim()}
              icon={<AngleUpIcon />}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none'
              }}
              aria-label="Send message"
            />
          </div>
        </StackItem>
      </Stack>
    </div>
  );
};

export default ChatTab;
