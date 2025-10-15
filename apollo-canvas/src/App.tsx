import React, { useState, useEffect, useRef } from 'react';
import {
  Page,
  PageSection,
  Drawer,
  DrawerContent,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  Title,
} from '@patternfly/react-core';
import ApolloCanvasMasthead from './components/ApolloCanvasMasthead';
import LeftDrawerContent from './components/LeftDrawerContent';
import RightDrawerContent from './components/RightDrawerContent';
import { ThemeProvider } from './components/ThemeContext';

const App: React.FC = () => {
  const [isLeftDrawerExpanded, setIsLeftDrawerExpanded] = useState(false);
  const [isRightDrawerExpanded, setIsRightDrawerExpanded] = useState(false);
  const [iframeTitle, setIframeTitle] = useState('OpenShift AI Dashboard');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from the iframe's origin
      if (event.origin !== 'http://localhost:4010') {
        return;
      }

      // Listen for title updates
      if (event.data && event.data.type === 'TITLE_UPDATE' && event.data.title) {
        setIframeTitle(event.data.title);
      }
    };

    // Add event listener for postMessage
    window.addEventListener('message', handleMessage);

    // Also try to get initial title when iframe loads
    const handleIframeLoad = () => {
      if (iframeRef.current?.contentWindow) {
        // Request the initial title
        iframeRef.current.contentWindow.postMessage(
          { type: 'REQUEST_TITLE' }, 
          'http://localhost:4010'
        );
        // Send initial selection mode state
        iframeRef.current.contentWindow.postMessage(
          { type: 'SELECTION_MODE_UPDATE', isSelectMode }, 
          'http://localhost:4010'
        );
      }
    };

    // Set up load listener
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  // Send selection mode updates to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SELECTION_MODE_UPDATE', isSelectMode }, 
        'http://localhost:4010'
      );
    }
  }, [isSelectMode]);

  return (
    <ThemeProvider>
      <Page
        masthead={
          <ApolloCanvasMasthead
            onLeftDrawerToggle={() => setIsLeftDrawerExpanded(!isLeftDrawerExpanded)}
            onRightDrawerToggle={() => setIsRightDrawerExpanded(!isRightDrawerExpanded)}
          />
        }
      >
        <Drawer isExpanded={isLeftDrawerExpanded} isInline position="left">
          <DrawerContent
            panelContent={
              <DrawerPanelContent isResizable minSize="300px" defaultSize="400px">
                <DrawerHead>
                <Title headingLevel="h3" size="2xl">Context</Title>
                  <DrawerActions>
                    <DrawerCloseButton onClick={() => setIsLeftDrawerExpanded(false)} />
                  </DrawerActions>
                </DrawerHead>
                <DrawerPanelBody>
                  <LeftDrawerContent 
                    isSelectMode={isSelectMode}
                    setIsSelectMode={setIsSelectMode}
                    title={iframeTitle}
                  />
                </DrawerPanelBody>
              </DrawerPanelContent>
            }
          >
            <Drawer isExpanded={isRightDrawerExpanded} isInline position="right">
              <DrawerContent
                panelContent={
                  <DrawerPanelContent isResizable minSize="300px" defaultSize="400px">
                    <DrawerHead>
                      <Title headingLevel="h3" size="2xl">Discussions</Title>
                      <DrawerActions>
                        <DrawerCloseButton onClick={() => setIsRightDrawerExpanded(false)} />
                      </DrawerActions>
                    </DrawerHead>
                    <DrawerPanelBody>
                      <RightDrawerContent />
                    </DrawerPanelBody>
                  </DrawerPanelContent>
                }
              >
                <PageSection variant="secondary" padding={{ default: 'noPadding' }}>
                  <div className={`apollo-canvas-main-content ${isSelectMode ? 'apollo-canvas-selection-active' : ''}`}>
                    <iframe
                      ref={iframeRef}
                      src="http://localhost:4010"
                      title="OpenShift AI Dashboard"
                      data-selection-mode={isSelectMode ? 'true' : 'false'}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                      allow="web-share"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
                    />
                  </div>
                </PageSection>
              </DrawerContent>
            </Drawer>
          </DrawerContent>
        </Drawer>
      </Page>
    </ThemeProvider>
  );
};

export default App;
