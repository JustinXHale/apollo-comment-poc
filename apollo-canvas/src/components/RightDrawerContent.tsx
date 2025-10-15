import React, { useState } from 'react';
import {
  Stack,
  StackItem,
  Title,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Button,
  ExpandableSection,
  Badge,
  Avatar,
  Grid,
  GridItem,
  Split,
  SplitItem,
  CodeBlock,
  CodeBlockCode,
  Flex,
  FlexItem,
  TextInput,
} from '@patternfly/react-core';
import { CommentIcon, UserIcon } from '@patternfly/react-icons';

// Import persona images
import persona1 from '../assets/personas/persona-1.png';
import persona2 from '../assets/personas/persona-2.png';
import persona3 from '../assets/personas/persona-3.png';
import persona4 from '../assets/personas/persona-4.png';
import persona5 from '../assets/personas/persona-5.png';
import persona6 from '../assets/personas/persona-6.png';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  type?: 'text' | 'code' | 'image' | 'video';
}

interface DiscussionThread {
  id: string;
  title: string;
  commentCount: number;
  comments: Comment[];
}

const RightDrawerContent: React.FC = () => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('All');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Latest');
  const [expandedThreads, setExpandedThreads] = useState<string[]>([]);

  const discussionThreads: DiscussionThread[] = [
    {
      id: 'thread-1',
      title: 'API Design for MaaS 3.0',
      commentCount: 4,
      comments: [
        {
          id: 'c1',
          author: 'Sarah Chen',
          avatar: persona1,
          content: 'I think we should adopt a GraphQL-first approach for the Models-as-a-Service API. It would give clients better flexibility in querying model metadata.',
          timestamp: '2 hours ago'
        },
        {
          id: 'c1-r1',
          author: 'Mike Rodriguez',
          avatar: persona2,
          content: 'GraphQL sounds appealing but I\'m concerned about the learning curve for our existing REST API consumers. Maybe we could offer both?',
          timestamp: '1 hour ago'
        },
        {
          id: 'c1-r2',
          author: 'Sarah Chen',
          avatar: persona1,
          content: 'Good point. We could implement a GraphQL layer over our REST endpoints. Here\'s a quick example:',
          timestamp: '45 minutes ago',
          type: 'code'
        },
        {
          id: 'c2',
          author: 'Alex Kim',
          avatar: persona3,
          content: 'Have we considered how this will affect our current model versioning strategy? The 3.0 release should address some of the versioning pain points.',
          timestamp: '3 hours ago'
        }
      ]
    },
    {
      id: 'thread-2',
      title: 'Model Deployment Architecture',
      commentCount: 3,
      comments: [
        {
          id: 'c3',
          author: 'Jennifer Park',
          avatar: persona4,
          content: 'I\'ve been exploring containerized model deployment patterns. Here\'s a diagram of the proposed architecture:',
          timestamp: '4 hours ago',
          type: 'image'
        },
        {
          id: 'c4',
          author: 'David Thompson',
          avatar: persona5,
          content: 'This looks promising! How does this handle auto-scaling during peak traffic? We saw issues in 2.x with sudden load spikes.',
          timestamp: '3 hours ago',
          type: 'video'
        },
        {
          id: 'c4-r1',
          author: 'Jennifer Park',
          avatar: persona4,
          content: 'Great question! The new architecture uses Kubernetes HPA with custom metrics. Here\'s the YAML config:',
          timestamp: '2 hours ago',
          type: 'code'
        }
      ]
    },
    {
      id: 'thread-3',
      title: 'User Experience & Model Discovery',
      commentCount: 2,
      comments: [
        {
          id: 'c5',
          author: 'Lisa Wang',
          avatar: persona6,
          content: 'The current model catalog is hard to navigate. For 3.0, I propose we add smart search and recommendation features. Here\'s a mockup of the new interface:',
          timestamp: '6 hours ago',
          type: 'video'
        },
        {
          id: 'c6',
          author: 'Roberto Santos',
          avatar: persona2,
          content: 'Love the visual direction! The search filters look much more intuitive. One concern: how do we ensure model descriptions are consistent across teams?',
          timestamp: '5 hours ago'
        }
      ]
    }
  ];

  // Initialize all comments as expanded by default
  const allCommentIds = discussionThreads.flatMap(thread => thread.comments.map(comment => comment.id));
  const [expandedComments, setExpandedComments] = useState<string[]>(allCommentIds);

  const toggleThread = (threadId: string) => {
    setExpandedThreads(prev => 
      prev.includes(threadId) 
        ? prev.filter(id => id !== threadId)
        : [...prev, threadId]
    );
  };

  const toggleComment = (commentId: string) => {
    setExpandedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const allThreadsExpanded = expandedThreads.length === discussionThreads.length;

  const toggleAllThreads = () => {
    if (allThreadsExpanded) {
      // Collapse all threads
      setExpandedThreads([]);
    } else {
      // Expand all threads
      setExpandedThreads(discussionThreads.map(thread => thread.id));
    }
  };

  const renderComment = (comment: Comment) => {
    const isExpanded = expandedComments.includes(comment.id);
    
    return (
      <div key={comment.id} style={{ marginBottom: '16px' }}>
        <ExpandableSection
          toggleContent={
            <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Avatar src={comment.avatar} alt={comment.author} size="sm" />
              </FlexItem>
              <FlexItem>
                <small>
                  <strong>{comment.author}</strong> • {comment.timestamp}
                </small>
              </FlexItem>
            </Flex>
          }
          isExpanded={isExpanded}
          onToggle={() => toggleComment(comment.id)}
        >
          <div style={{ marginLeft: '30px' }}>
            {comment.type === 'code' ? (
              <>
                <p style={{ marginBottom: '8px' }}>
                  {comment.content}
                </p>
                <CodeBlock>
                  <CodeBlockCode>
{comment.id === 'c4-r1' ? 
`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: model-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: model-server
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70` :
`type ModelAPI {
  id: ID!
  name: String!
  version: String!
  metadata: ModelMetadata
}

type Query {
  models(filter: ModelFilter): [ModelAPI]
  model(id: ID!): ModelAPI
}`}
                  </CodeBlockCode>
                </CodeBlock>
              </>
            ) : comment.type === 'image' ? (
              <>
                <p style={{ marginBottom: '8px' }}>
                  {comment.content}
                </p>
                <div style={{ 
                  height: '150px', 
                  backgroundColor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '4px',
                  maxWidth: '300px'
                }}>
                  <small style={{ color: '#666' }}>
                    [Architecture Diagram]
                  </small>
                </div>
              </>
            ) : comment.type === 'video' ? (
              <>
                <p style={{ marginBottom: '8px' }}>
                  {comment.content}
                </p>
                {comment.id === 'c4' ? (
                  <iframe
                    width="100%"
                    height="225"
                    src="https://www.youtube.com/embed/U6B8e18zvKs"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ borderRadius: '4px', maxWidth: '400px' }}
                  ></iframe>
                ) : (
                  <div style={{ 
                    height: '150px', 
                    backgroundColor: '#000', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '4px',
                    maxWidth: '300px'
                  }}>
                    <small style={{ color: '#fff' }}>
                      ▶ UX Mockup Demo
                    </small>
                  </div>
                )}
              </>
            ) : (
              <p>
                {comment.content}
              </p>
            )}
          </div>
        </ExpandableSection>
      </div>
    );
  };

  return (
    <div style={{ height: '100%' }}>
      <Stack hasGutter>
        
        {/* Controls */}
        <StackItem>
          <Split hasGutter>
            <SplitItem>
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Dropdown
                    isOpen={filterDropdownOpen}
                    onSelect={() => setFilterDropdownOpen(false)}
                    onOpenChange={setFilterDropdownOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        variant="plainText"
                      >
                        {filterBy}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="all" onClick={() => setFilterBy('All')}>
                        All
                      </DropdownItem>
                      <DropdownItem key="recommended" onClick={() => setFilterBy('Recommended')}>
                        Recommended
                      </DropdownItem>
                      <DropdownItem key="most-active" onClick={() => setFilterBy('Most Active')}>
                        Most Active
                      </DropdownItem>
                      <DropdownItem key="resolved" onClick={() => setFilterBy('Resolved')}>
                        Resolved
                      </DropdownItem>
                      <DropdownItem key="stale" onClick={() => setFilterBy('Stale')}>
                        Stale
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={sortDropdownOpen}
                    onSelect={() => setSortDropdownOpen(false)}
                    onOpenChange={setSortDropdownOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                        variant="plainText"
                      >
                        {sortBy}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="latest" onClick={() => setSortBy('Latest')}>
                        Latest
                      </DropdownItem>
                      <DropdownItem key="oldest" onClick={() => setSortBy('Oldest')}>
                        Oldest
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
              </Flex>
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              <Button variant="link" isInline onClick={toggleAllThreads}>
                {allThreadsExpanded ? 'Collapse all' : 'Expand all'}
              </Button>
            </SplitItem>
          </Split>
        </StackItem>

        {/* Discussion Threads */}
        {discussionThreads.map(thread => (
          <StackItem key={thread.id}>
            <ExpandableSection
              toggleContent={
                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <CommentIcon />
                  </FlexItem>
                  <FlexItem>
                    <h6 style={{ margin: 0 }}>
                      {thread.title}
                    </h6>
                  </FlexItem>
                  <FlexItem>
                    <Badge isRead>{thread.commentCount}</Badge>
                  </FlexItem>
                </Flex>
              }
              isExpanded={expandedThreads.includes(thread.id)}
              onToggle={() => toggleThread(thread.id)}
            >
              <div style={{ paddingLeft: '16px' }}>
                {thread.comments.map(comment => renderComment(comment))}
                <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                  <TextInput
                    placeholder="Reply..."
                    aria-label={`Reply to ${thread.title}`}
                  />
                </div>
              </div>
            </ExpandableSection>
          </StackItem>
        ))}
      </Stack>
    </div>
  );
};

export default RightDrawerContent;
