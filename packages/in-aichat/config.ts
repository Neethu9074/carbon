/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { EventsCustomSendMessages } from 'in-aichat/CustomSendMessages/EventsCustomSendMessages';
import { EventsPromptLibrary } from 'in-aichat/PromptLibraries/EventsPromptLibrary';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { eventsAIChatEnabled } from 'in-services/featureFlags';

type AgentConfig = {
  path: string;
  customSendMessages: typeof EventsCustomSendMessages;
  promptLibrary: typeof EventsPromptLibrary;
  featureFlag: boolean;
  showAgentModeToggle: boolean;
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
    featureFlag: eventsAIChatEnabled,
    showAgentModeToggle: true
  }
};
