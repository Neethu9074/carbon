/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useEffect, useMemo, useState } from 'react';
import { merge } from 'lodash';

import { BusEventType, ChatContainer, ChatInstance, ViewType, PublicConfig } from '@instana/ai-chat';
import { PreviewPill } from '@instana/components';

import {
  handleTracking,
  moveAIChatLauncher,
  setupDragListeners,
  setupCustomLanguagePack,
  useAgentSpecificData,
  AI_CHAT_TAG_NAME,
  LAUNCHER_BUTTON_ID,
  WAC_WIDGET
} from 'in-events/components/AIChat/utils/utils';
import { CustomResponseDefinition } from 'in-events/components/AIChat/UserDefinedResponse';
import { EVENT_AI_CHAT_OPEN, EVENT_AI_CHAT_CLOSE } from 'in-services/tracking/tracking';
import LauncherButton from 'in-events/components/AIChat/components/LauncherButton';
import UserDefinedResponse from 'in-events/components/AIChat/UserDefinedResponse';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

import locals from './AIChat.mless';

// Extended ChatInstance type to include our custom properties
interface ExtendedChatInstance extends ChatInstance {
  trackCta?: any;
}

interface AIChatProps {
  config?: PublicConfig;
  customResponseDefinitions?: CustomResponseDefinition[];
  customMenuOptions?: (...args: any[]) => CustomMenuOption[];
  customPanelConfig?: CustomPanelConfig;
  onAfterRender?: (ChatInstance: ExtendedChatInstance) => void;
  onBeforeRender?: (ChatInstance: ExtendedChatInstance) => void;
  aiToolTipContent?: React.ReactNode;
  previewPill?: boolean;
}

type CustomMenuOption = {
  text: string;
  handler: () => void;
};

type CustomPanelConfig = {
  customPanelElement: (...args: any[]) => JSX.Element;
};

export function AIChat({
  customResponseDefinitions,
  customMenuOptions,
  customPanelConfig,
  config,
  onAfterRender,
  onBeforeRender,
  aiToolTipContent,
  previewPill = false
}: AIChatProps) {
  // Get agent data from our configuration file
  // If agentData is undefined then we are not on a page where
  // the chat should be rendered
  const agentData = useAgentSpecificData();
  const customPanelElement = customPanelConfig?.customPanelElement;

  // This will move the Chat launcher back to original location.
  // This is needed because we need it to reset on page navigation
  useEffect(() => {
    moveAIChatLauncher('50px');
    setupDragListeners();
  }, []);

  const { trackCta } = useSegmentTracking();
  const [instance, setInstance] = useState<ExtendedChatInstance | null>(null);

  // Combine the default config with the config
  // passed in.  Config supersedes the default.
  const chatConfig = useMemo(() => {
    if (!agentData) {
      return {};
    } else {
      const defaultConfig = {
        messaging: {
          customSendMessage: agentData.customSendMessages,
          disablePDFViewer: true
        },
        showLauncher: false
      };
      return merge({}, defaultConfig, config);
    }
  }, [config, agentData]);

  const renderWriteableElements = useMemo(() => {
    if (!agentData) {
      return {};
    } else {
      return {
        customPanelElement: customPanelElement && customPanelElement(instance, agentData.promptLibrary),
        headerBottomElement: previewPill && <PreviewPill className={locals.previewPill} />,
        aiTooltipAfterDescriptionElement: aiToolTipContent
      };
    }
  }, [instance, customPanelElement, previewPill, aiToolTipContent, agentData]);

  // If no Agent data for this page exists we won't render the chat
  // This check is moved here after all hooks have been called
  if (!agentData) {
    return null;
  }

  /**
   * Set up launcher button for the AI Chat
   * @param chatInstance - The chat instance
   */
  const setupLauncherButton = (chatInstance: ExtendedChatInstance) => {
    const launcherElement = document.getElementById(LAUNCHER_BUTTON_ID);
    if (!launcherElement) return;

    // Listen to when the launcher is clicked and open mainWindow
    launcherElement.addEventListener('click', () => {
      handleTracking(EVENT_AI_CHAT_OPEN);
      chatInstance?.changeView(ViewType.MAIN_WINDOW);
      launcherElement.style.display = 'none';
      const elements = document.getElementsByTagName(AI_CHAT_TAG_NAME);
      if (elements.length === 1) {
        const movable = elements[0].shadowRoot?.getElementById(WAC_WIDGET);
        if (movable) {
          movable.style.right = `32px`;
          movable.style.bottom = `32px`;
        }
      }
      // Still need to wait for render
      setTimeout(() => {
        setupDragListeners();
      }, 500);
    });

    // Whenever the chat window opens / closes we want to hide / show the launcher button
    chatInstance.on({
      type: 'view:change' as BusEventType,
      handler: (event: any) => {
        if (event.newViewState.mainWindow) {
          launcherElement.style.display = 'none';
        } else {
          // The AI Chat has been closed so we are no longer hiding the AI Launcher
          handleTracking(EVENT_AI_CHAT_CLOSE);
          launcherElement.style.display = '';
        }
      }
    });
  };

  return (
    <>
      <ChatContainer
        config={chatConfig}
        renderWriteableElements={renderWriteableElements}
        renderUserDefinedResponse={(props, chatInstance) => (
          <UserDefinedResponse
            messageItem={props.messageItem}
            instance={chatInstance}
            customResponseDefinitions={customResponseDefinitions}
          />
        )}
        onBeforeRender={(chatInstance: ExtendedChatInstance) => {
          chatInstance.trackCta = trackCta;
          setInstance(chatInstance);
          onBeforeRender && onBeforeRender(chatInstance);
        }}
        onAfterRender={(chatInstance: ExtendedChatInstance) => {
          setupCustomLanguagePack(chatInstance);
          if (customMenuOptions) {
            const customPanel = chatInstance.customPanels.getPanel();
            chatInstance.updateCustomMenuOptions(customMenuOptions(customPanel));
          }
          setupLauncherButton(chatInstance);
          setupDragListeners();
          onAfterRender && onAfterRender(chatInstance);
        }}
      />
      <LauncherButton />
    </>
  );
}

export default AIChat;
