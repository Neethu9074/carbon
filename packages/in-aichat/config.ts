/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error - No type definitions available
import { viewPathFullyQualified } from 'in-custom-dashboards/navigation/url';
import { DashboardCustomSendMessages } from 'in-aichat/CustomSendMessages/DashboardCustomSendMessages';
import { customDashboardsPromptingEnabled, eventsAIChatEnabled } from 'in-services/featureFlags';
import { EventsCustomSendMessages } from 'in-aichat/CustomSendMessages/EventsCustomSendMessages';
import { DashboardPromptLibrary } from 'in-aichat/PromptLibraries/DashboardPromptLibrary';
import { EventsPromptLibrary } from 'in-aichat/PromptLibraries/EventsPromptLibrary';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { t } from 'in-i18n';

type AgentConfig = {
  path: string;
  customSendMessages: typeof EventsCustomSendMessages;
  promptLibrary: typeof EventsPromptLibrary;
  model: string;
  featureFlag: boolean;
};

/*
 * This configuration for the AI Chat component determines if the chat
 * should be rendered on a page.
 *
 * Each page talks to its own specific agent configuration and thus
 * the configuration requires an entry per agent along with the path
 * it should be rendered.
 *
 * As we grow the chat outward onto additional pages, additional
 * agent configurations should be added accordingly.
 */

export const agentConfigurations: Record<string, AgentConfig> = {
  [eventsPath]: {
    path: eventsPath,
    customSendMessages: EventsCustomSendMessages,
    promptLibrary: EventsPromptLibrary,
    model: t('in-aichat:aichat.mistralMedium'),
    featureFlag: eventsAIChatEnabled
  },
  [viewPathFullyQualified]: {
    path: viewPathFullyQualified,
    customSendMessages: DashboardCustomSendMessages,
    promptLibrary: DashboardPromptLibrary,
    model: t('in-aichat:aichat.graniteInstruct'),
    featureFlag: customDashboardsPromptingEnabled
  }
};
