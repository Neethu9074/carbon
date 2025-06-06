/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { PreviewPill, Typography } from '@instana/components';
import { ChatContainer, TextItem } from '@instana/ai-chat';
import { Widget } from '@instana/types';

import { InferredSlotConfig, PossibleSlotConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { ConfigMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/ConfigMessage';
import { customSendMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/customSendMessage';

const chatConfig = {
  namespace: 'custom-dashboards',
  messaging: { customSendMessage }
};

interface AiChatContainerProps {
  beforeRender: () => void;
  onAddPromptedWidget: (widget: Widget) => void;
}

export const AiChatContainer = ({ beforeRender, onAddPromptedWidget }: AiChatContainerProps) => {
  return (
    <ChatContainer
      config={chatConfig}
      onBeforeRender={instance => {
        beforeRender();
        instance.updateLauncherGreetingMessage('Hello, you can create some widgets via chat too!');
        // TODO: improve style modification - maybe check with @carbon/ai-chat team
        instance.updateCSSVariables({ 'BASE-width': '700px', 'BASE-max-height': '950px' });
        instance.messaging.addMessage({
          output: {
            generic: [
              {
                response_type: 'text',
                // no translation because only English is possible as of now.
                text: 'Hi, I am here to help you with creating widgets'
              } as TextItem
            ]
          }
        });
      }}
      renderUserDefinedResponse={({ messageItem }) => {
        if (messageItem?.user_defined) {
          const { inferredSlotConfig, possibleSlotConfig } = messageItem.user_defined;
          return (
            <ConfigMessage
              inferredSlotConfig={inferredSlotConfig as InferredSlotConfig}
              possibleSlotConfig={possibleSlotConfig as PossibleSlotConfig}
              onAddPromptedWidget={onAddPromptedWidget}
            />
          );
        }
        return null;
      }}
      renderWriteableElements={{
        beforeInputElement: () => (
          <>
            <PreviewPill />
            <Typography variant="label-01">This is a preview feature powered by watsonx</Typography>
          </>
        )
      }}
      forceReact17Mode
    />
  );
};
