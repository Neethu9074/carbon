/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

// @ts-expect-error - No type definitions available
import { EventsCustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages/EventsCustomSendMessages';
import {
  EVENT_AI_LIBRARY_OPEN,
  EVENT_AI_CHAT_FEEDBACK_MENU_CLICK,
  EVENT_AI_LIBRARY_SELECTION_MADE
} from 'in-services/tracking/tracking';
import AITooltipContent from 'in-events/components/AIChat/components/AITooltipContent';
import InstructionPop from 'in-events/components/AIChat/CustomPanels/InstructionPop';
import PromptLibrary from 'in-events/components/AIChat/CustomPanels/PromptLibrary';
import { handleTracking } from 'in-events/components/AIChat/utils/utils';
import { AIChat } from 'in-events/components/AIChat/AIChat';
import { t } from 'in-i18n';

export default function AIChatInstance() {
  const [instructionPopOpen, setInstructionPopOpen] = useState<boolean>(false);
  return (
    <>
      <AIChat
        customMenuOptions={customPanel => {
          return [
            {
              text: t('in-events:aichat.promptLibrary'),
              handler: () => {
                customPanel.open({ title: t('in-events:aichat.promptLibrary') });
                handleTracking(EVENT_AI_LIBRARY_OPEN);
                setInstructionPopOpen(false);
              }
            },
            {
              text: t('in-events:aichat.feedback'),
              handler: () => {
                handleTracking(EVENT_AI_CHAT_FEEDBACK_MENU_CLICK);
                window.open('https://your.feedback.ibm.com/jfe/form/SV_7Oj9seFbD9zb4eq', '_blank');
              }
            }
          ];
        }}
        customPanelConfig={{
          customPanelElement: (instance, prompts) => {
            return (
              <PromptLibrary
                library={prompts}
                instance={instance}
                setInstructionPopOpen={setInstructionPopOpen}
                trackingIdentifier={EVENT_AI_LIBRARY_SELECTION_MADE}
              />
            );
          }
        }}
        aiToolTipContent={<AITooltipContent />}
        previewPill
      />
      {instructionPopOpen && <InstructionPop setInstructionPopOpen={setInstructionPopOpen} />}
    </>
  );
}
