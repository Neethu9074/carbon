/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  EVENT_AI_LIBRARY_OPEN,
  EVENT_AI_CHAT_FEEDBACK_MENU_CLICK,
  EVENT_AI_LIBRARY_SELECTION_MADE
} from 'in-services/tracking/tracking';
// @ts-expect-error - No type definitions available
import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
import AITooltipContent from 'in-events/components/AIChat/components/AITooltipContent';
import InstructionPop from 'in-events/components/AIChat/CustomPanels/InstructionPop';
import PromptLibrary from 'in-events/components/AIChat/CustomPanels/PromptLibrary';
import { handleTracking } from 'in-events/components/AIChat/utils/utils';
import { AIChat } from 'in-events/components/AIChat/AIChat';
import { t } from 'in-i18n';

export default function AIChatEvents() {
  const [instructionPopOpen, setInstructionPopOpen] = useState<boolean>(false);
  return (
    <>
      <AIChat
        config={config}
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
          customPanelElement: instance => {
            return (
              <PromptLibrary
                library={promptLibrary}
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

// Configuration to be passed to the AI Chat
const config = {
  messaging: {
    customSendMessage: CustomSendMessages
  }
};

// Prompt library information for helpful queries
export const promptLibrary = [
  {
    kind: 'Application',
    questions: [
      'Show me calls with high latency for service <service-name> in app <app-name>.',
      'Show me erroneous calls for service <service-name>.',
      'Show me calls with status code 5XX received by service <service-name>.',
      'Show me calls which spiked in last <duration> minutes in service <service-name>.'
    ]
  },
  {
    kind: 'Infrastructure',
    questions: [
      'Show me the total number of failed queries to DB2 database with host name <host-name>.',
      'Show me the total number of runnable threads, new threads, and threads in timed-waiting for all JVMs running on namespace <namespace-name>.',
      'Show me the top <number> queues with highest queue depth for last <duration> minutes group. Group by queue name.',
      'What is the sum of aggregated CPU requests for kubernetes deployment <app-name> in namespace <namespace-name> for last <duration> hours?',
      'What is the count of pods for deployments labeled as environment=<environment-name> in the namespace <namespace-name>?'
    ]
  },
  {
    kind: 'Events',
    questions: [
      'What are todays open incidents for app <app-name>?',
      'List all the incidents in the last hour grouped by app <app-name>.',
      'How many incidents have occurred on service <service-name> in the last week?',
      'How many application events generated in the last 45 minutes had a "high error rate" problem.',
      'Show me kubernetes pod changes grouped by label <label>.',
      'How many JVM incidents are still open?',
      'Show me closed incidents from the last <number> days?'
    ]
  }
];
