/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const aihubRoot = '/aiGateway';

export const aihubGateways = '/LLMgateways';
export const aihubAIAgents = '/aiAgents';

export const aihubGatewaysFullyQualified = `${aihubRoot}${aihubGateways}` as const;
export const aihubAIAgentsFullyQualified = `${aihubRoot}${aihubAIAgents}` as const;

export const isAIHubView = getRootPathPredicate(aihubRoot);
