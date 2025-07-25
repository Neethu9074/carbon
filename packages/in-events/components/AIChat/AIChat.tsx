/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useEffect, useMemo, useState } from 'react';

import { BusEventType, ChatContainer, ChatInstance, ViewType } from '@instana/ai-chat';
import { PreviewPill } from '@instana/components';

import {
  handleTracking,
  moveAIChatLauncher,
  setupDragListeners,
  setupCustomLanguagePack,
  AI_CHAT_TAG_NAME,
  LAUNCHER_BUTTON_ID
} from 'in-events/components/AIChat/utils/utils';
import {
  EVENT_AI_CHAT_OPEN,
  EVENT_AI_CHAT_CLOSE,
  EVENT_AI_LIBRARY_OPEN,
  EVENT_AI_CHAT_FEEDBACK_MENU_CLICK
} from 'in-services/tracking/tracking';
import InstructionPop from 'in-events/components/AIChat/CustomPanels/InstructionPop';
// @ts-expect-error - No type definitions available
import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
import PromptLibrary from 'in-events/components/AIChat/CustomPanels/PromptLibrary';
import AITooltipContent from 'in-events/components/AIChat/components/AITooltipContent';
import LauncherButton from 'in-events/components/AIChat/components/LauncherButton';
import UserDefinedResponse from 'in-events/components/AIChat/UserDefinedResponse';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { t } from 'in-i18n';

import locals from './AIChat.mless';

// Configuration to be passed to the AI Chat
const config = {
  messaging: {
    disablePDFViewer: true,
    customSendMessage: CustomSendMessages
  },
  showLauncher: false
};

// Extended ChatInstance type to include our custom properties
interface ExtendedChatInstance extends ChatInstance {
  trackCta?: any;
}

export function AIChat() {
  // This will move the Chat launcher back to original location.
  // This is needed because we need it to reset on page navigation
  useEffect(() => {
    moveAIChatLauncher('50px');
    setupDragListeners();
  }, []);

  const { trackCta } = useSegmentTracking();
  const [instance, setInstance] = useState<ExtendedChatInstance | null>(null);
  const [popOpen, setPopOpen] = useState<boolean>(false);

  const renderWriteableElements = useMemo(
    () => ({
      customPanelElement: <PromptLibrary instance={instance as ExtendedChatInstance} setPopOpen={setPopOpen} />,
      headerBottomElement: <PreviewPill className={locals.previewPill} />,
      aiTooltipAfterDescriptionElement: <AITooltipContent />
    }),
    [instance]
  );

  /**
   * Set up custom menu options for the AI Chat
   * @param chatInstance - The chat instance
   */
  const setupCustomMenuOptions = (chatInstance: ExtendedChatInstance) => {
    const customPanel = chatInstance.customPanels.getPanel();
    const panelOptions = {
      title: t('in-events:aichat.promptLibrary')
    };
    chatInstance.updateCustomMenuOptions([
      {
        text: t('in-events:aichat.promptLibrary'),
        handler: () => {
          customPanel.open(panelOptions);
          handleTracking(EVENT_AI_LIBRARY_OPEN);
          setPopOpen(false);
        }
      },
      {
        text: t('in-events:aichat.feedback'),
        handler: () => {
          handleTracking(EVENT_AI_CHAT_FEEDBACK_MENU_CLICK);
          window.open('https://your.feedback.ibm.com/jfe/form/SV_7Oj9seFbD9zb4eq', '_blank');
        }
      }
    ]);
  };

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
        const movable = elements[0].shadowRoot?.getElementById('WACWidget');
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
          setPopOpen(false);
        }
      }
    });
  };

  return (
    <>
      <ChatContainer
        config={config}
        renderWriteableElements={renderWriteableElements}
        renderUserDefinedResponse={(props, chatInstance) => (
          <UserDefinedResponse messageItem={props.messageItem} instance={chatInstance} />
        )}
        onBeforeRender={(chatInstance: ExtendedChatInstance) => {
          chatInstance.trackCta = trackCta;
          setInstance(chatInstance);
        }}
        onAfterRender={(chatInstance: ExtendedChatInstance) => {
          setupCustomLanguagePack(chatInstance);
          setupCustomMenuOptions(chatInstance);
          setupLauncherButton(chatInstance);
          setupDragListeners();
        }}
      />
      {popOpen && <InstructionPop setPopOpen={setPopOpen} />}
      <LauncherButton />
    </>
  );
}

export default AIChat;
