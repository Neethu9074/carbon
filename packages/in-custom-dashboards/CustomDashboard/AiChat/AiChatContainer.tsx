/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useCallback } from 'react';

import {
  ChatContainer,
  ChatInstance,
  MessageResponseTypes,
  PublicConfig,
  RenderUserDefinedState,
  TextItem,
  UserDefinedItem
} from '@instana/ai-chat';
import { PreviewPill, Typography } from '@instana/components';
import { Widget } from '@instana/types';

import {
  InferredSlotConfig,
  PossibleSlotConfig,
  UserDefinedType
} from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { ExampleMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/ExampleMessage';
// @ts-expect-error needs TS migration
import { enabledWidgets } from 'in-custom-dashboards/widgets';
import { ConfigMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/ConfigMessage';
import { customSendMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/customSendMessage';
import { hours } from 'in-services/time/time';
import { t } from 'in-i18n';

// no translation because only English is possible as of now.
const LAUNCHER_GREETING = t('in-custom-dashboards:aiChat.launcherGreeting');

// *** Using translations makes this hard to read, please also update this comment:
// Hello and welcome.

// AI-assisted widget creation is currently available for the following parameters:
// - **Language:**
//     - English
// - **Widget type:**
//     - Big number
//     - Chart: time series
//     - SLO (_not SLO Legacy_)
// - **Data source:**
//     - Applications (traces and calls)
// - **Filter:**
//     - Application name
//     - Call erroneous
//     - Call type
//     - Endpoint name
//     - Service name
//     - Technology name
const WELCOME_MESSAGE = `${t('in-custom-dashboards:aiChat.welcome')}

${t('in-custom-dashboards:aiChat.restrictions')}:
- **${t('language')}:**
    - ${t('language', { context: 'en-US' })}
- **${t('in-custom-dashboards:aiChat.widgetType')}:**
    - ${t('in-custom-dashboards:widgets.bigNumber.bigNumber')}
    - ${t('in-custom-dashboards:widgets.index.chartTimeSeries')}
    - ${t('in-custom-dashboards:widgets.slo.slo')} (_not ${t('in-custom-dashboards:widgets.slo.sloLegacy')}_)
- **${t('in-custom-dashboards:widgets.metricConfigurator.ds')}:**
    - ${t('in-custom-dashboards:widgets.srcApp.index.applicationsTracesAndCalls')}
- **${t('in-custom-dashboards:aiChat.filter')}:**
    - ${t('in-custom-dashboards:aiChat.filter', { context: 'application' })}
    - ${t('in-custom-dashboards:aiChat.filter', { context: 'service' })}
    - ${t('in-custom-dashboards:aiChat.filter', { context: 'endpoint' })}
    - ${t('in-custom-dashboards:aiChat.filter', { context: 'erroneousCall' })}
    - ${t('in-custom-dashboards:aiChat.filter', { context: 'callType' })}
    - ${t('in-custom-dashboards:aiChat.filter', { context: 'technology' })}
`;

const chatConfig: PublicConfig = {
  namespace: 'custom-dashboards',
  messaging: { customSendMessage }
};

interface AiChatContainerProps {
  beforeRender: () => void;
  onAddPromptedWidget: (widget: Widget) => void;
}

export const AiChatContainer = ({ beforeRender, onAddPromptedWidget }: AiChatContainerProps) => {
  const renderUserDefinedResponse = useCallback(
    ({ messageItem }: RenderUserDefinedState, instance: ChatInstance) => {
      switch (messageItem?.user_defined?.user_defined_type) {
        case UserDefinedType.EXAMPLES:
          return <ExampleMessage instance={instance} />;
        case UserDefinedType.SLOTS: {
          const { inferredSlotConfig, possibleSlotConfig } = messageItem.user_defined;
          return (
            <ConfigMessage
              inferredSlotConfig={inferredSlotConfig as InferredSlotConfig}
              possibleSlotConfig={possibleSlotConfig as PossibleSlotConfig}
              onAddPromptedWidget={onAddPromptedWidget}
            />
          );
        }
        default:
          return undefined;
      }
    },
    [onAddPromptedWidget]
  );

  return (
    <ChatContainer
      config={chatConfig}
      onBeforeRender={instance => {
        beforeRender();
        configureInstance(instance);
      }}
      renderUserDefinedResponse={renderUserDefinedResponse}
      renderWriteableElements={{
        beforeInputElement: () => (
          <>
            <PreviewPill />
            <Typography variant="label-01">This is a preview feature powered by watsonx</Typography>
          </>
        )
      }}
    />
  );
};

const configureInstance = (instance: ChatInstance) => {
  instance.showLauncherGreetingMessage(hours.toMillis(24));
  instance.updateLauncherGreetingMessage(LAUNCHER_GREETING);
  // TODO: improve style modification - maybe check with @carbon/ai-chat team
  instance.updateCSSVariables({ 'BASE-width': '700px', 'BASE-max-height': '950px' });
  instance.messaging.addMessage({
    id: 'welcome',
    output: {
      generic: [
        {
          response_type: MessageResponseTypes.TEXT,
          text: WELCOME_MESSAGE
        } as TextItem
      ]
    }
  });
  instance.messaging.addMessage({
    id: 'examples',
    output: {
      generic: [
        {
          response_type: MessageResponseTypes.USER_DEFINED,
          user_defined: {
            user_defined_type: UserDefinedType.EXAMPLES
          }
        } as UserDefinedItem
      ]
    }
  });
};
