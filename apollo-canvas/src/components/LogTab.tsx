import React from 'react';
import {
  Title,
  ProgressStepper,
  ProgressStep,
  Content,
  Popover,
} from '@patternfly/react-core';

const ChangelogTab: React.FC = () => {
  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
        History
      </Title>

      <Content>
        <Content component="p">
          The history of this design across all <a href="">Sources</a> (Meetings, Slack, Jira, Drive, etc.)
        </Content>
        <Content component="p">
          
        </Content>
      </Content>
      
      <ProgressStepper
        isVertical={true}
        aria-label="UX Design changelog progress stepper"
      >
        <ProgressStep
          variant="pending"
          description="Iteration 4 is on the agenda for Thursday's Stakeholder Review meeting."
          id="changelog-step1"
          titleId="changelog-step1-title"
          aria-label="completed step, masthead navigation refinement"
        >
          Design Review this Thursday
        </ProgressStep>

        <ProgressStep
          variant="success"
          description="Jan 15, 2025 3:45 PM - Gabriel created a new iteration of this design to include a Panda Stack reboot form based on the recent archicture decision."
          id="changelog-step1"
          titleId="changelog-step1-title"
          aria-label="completed step, masthead navigation refinement"
        >
          Iteration 4 created
        </ProgressStep>
        
        <ProgressStep
          variant="danger"
          description="Jan 12, 2025 11:20 AM - Due to technical restrictions with Panda Stack for 3.0, the Playground will have to be rebooted."
          id="changelog-step2"
          titleId="changelog-step2-title"
          aria-label="completed step, drawer component design implementation"
          popoverRender={(stepRef) => (
            <Popover
              aria-label="Additional information"
              headerContent={<div>First step popover</div>}
              bodyContent={<div>Additional info or help text content.</div>}
              triggerRef={stepRef}
              position="right"
            />
          )}
        >
          Jira: architects agree that Panda Stack needs to be rebooted
        </ProgressStep>
        
        <ProgressStep
          variant="warning"
          description="Jan 8, 2025 2:15 PM - Updated tab interface with cleaner visual design, improved contrast ratios, and better touch targets"
          id="changelog-step3"
          titleId="changelog-step3-title"
          aria-label="completed step, tab interface updates"
        >
          Slack: Jason discovered that Panda Stack may need to restart after config changes
        </ProgressStep>
        
        <ProgressStep
          variant="info"
          isCurrent
          description="Jan 5, 2025 9:30 AM - Currently implementing responsive breakpoints and mobile-first design patterns across all components"
          id="changelog-step4"
          titleId="changelog-step4-title"
          aria-label="current step, responsive design implementation"
        >
          Responsive Design Implementation
        </ProgressStep>
        
        <ProgressStep
          variant="success"
          description="Jan 2, 2025 4:00 PM - Planning comprehensive color palette updates to align with latest brand guidelines and accessibility standards"
          id="changelog-step5"
          titleId="changelog-step5-title"
          aria-label="pending step, color palette updates"
        >
          Iteration 3 completed
        </ProgressStep>
        
        <ProgressStep
          variant="success"
          description="Dec 28, 2024 1:45 PM - Scheduled implementation of advanced micro-interactions and animation system for enhanced user experience"
          id="changelog-step6"
          titleId="changelog-step6-title"
          aria-label="pending step, micro-interactions implementation"
        >
          Micro-interactions Framework
        </ProgressStep>
        
        <ProgressStep
          variant="success"
          description="Dec 20, 2024 10:15 AM - This design was discussed at the Stakeholder Review meeting. The group agreed that the wizard needed some adjustments."
          id="changelog-step7"
          titleId="changelog-step7-title"
          aria-label="completed step, accessibility compliance"
        >
          Design review complete, more changes needed
        </ProgressStep>
        
        <ProgressStep
          variant="success"
          description="Dec 15, 2024 3:20 PM - Established new design token system with PatternFly integration for consistent styling across components"
          id="changelog-step8"
          titleId="changelog-step8-title"
          aria-label="completed step, design token system"
        >
          Iteration 1 published
        </ProgressStep>
      </ProgressStepper>
    </div>
  );
};

export default ChangelogTab;
