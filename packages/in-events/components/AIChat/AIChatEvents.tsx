/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { EVENT_AI_LIBRARY_OPEN, EVENT_AI_CHAT_FEEDBACK_MENU_CLICK } from 'in-services/tracking/tracking';
import AITooltipContent from 'in-events/components/AIChat/components/AITooltipContent';
import InstructionPop from 'in-events/components/AIChat/CustomPanels/InstructionPop';
import PromptLibrary from 'in-events/components/AIChat/CustomPanels/PromptLibrary';
import { handleTracking } from 'in-events/components/AIChat/utils/utils';
import { AIChat } from 'in-events/components/AIChat/AIChat';
import { t } from 'in-i18n';

export default function AIChatEvents() {
  const [popOpen, setPopOpen] = useState<boolean>(false);
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
          ];
        }}
        customPanelConfig={{
          customPanelElement: instance => {
            return <PromptLibrary instance={instance} setPopOpen={setPopOpen} />;
          }
        }}
        aiToolTipContent={<AITooltipContent />}
        previewPill
      />
      {popOpen && <InstructionPop setPopOpen={setPopOpen} />}
    </>
  );
}
