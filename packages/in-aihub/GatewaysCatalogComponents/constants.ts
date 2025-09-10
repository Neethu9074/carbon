/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from 'in-i18n';

// Define types for task types
export type TaskType = {
  id: string;
  text: string;
};

// Define table headers
export const headers = [
  { key: 'name', header: t('in-aihub:gateways.columnLabels.name') },
  { key: 'capability', header: t('in-aihub:gateways.columnLabels.capability') },
  { key: 'type', header: t('in-aihub:gateways.columnLabels.type') },
  { key: 'serviceUsed', header: t('in-aihub:gateways.columnLabels.serviceUsed') },
  { key: 'aiModel', header: t('in-aihub:gateways.columnLabels.modelName') },
  { key: 'status', header: t('in-aihub:gateways.columnLabels.status', 'Status') },
  { key: 'endpointUrl', header: t('in-aihub:gateways.columnLabels.endpointUrl') },
  { key: 'actions', header: '' } // Actions column
];

// Define capability labels
export const capabilityLabels: Record<string, string> = {
  // Uppercase versions
  MANUAL_ACTION_GENERATION: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.actionGeneration'),
  INCIDENT_SUMMARIZATION: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.summaryGeneration'),
  SCRIPT_GENERATION: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.scriptGeneration'),
  // Lowercase versions
  manual_action_generation: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.actionGeneration'),
  incident_summarization: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.summaryGeneration'),
  script_generation: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.scriptGeneration')
};

// Model types with just labels (used for display in tables)
export const modelTypesLabels: Record<string, string> = {
  'ibm/granite-3-3-8b-instruct': 'Granite',
  mistral_medium: 'Mistral (medium)',
  mistral_large: 'Mistral (large)'
};

// Full model types with additional information (used in forms and selection UI)
export const modelTypes = [
  {
    id: 'ibm/granite-3-3-8b-instruct',
    name: 'Granite',
    description: t('in-aihub:gateways.createGateway.modelSelection.modelTypes.graniteDescription'),
    recommended: true
  },
  {
    id: 'mistralai/mistral-medium-2505',
    name: 'Mistral (medium)',
    description: t('in-aihub:gateways.createGateway.modelSelection.modelTypes.mistralMediumDescription'),
    recommended: false
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral (large)',
    description: t('in-aihub:gateways.createGateway.modelSelection.modelTypes.mistralLargeDescription'),
    recommended: false
  }
];

// Default task types used when API doesn't return capabilities
export const defaultTaskTypes = [
  {
    id: 'manual_action_generation',
    text: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.actionGeneration')
  },
  {
    id: 'incident_summarization',
    text: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.summaryGeneration')
  },
  {
    id: 'script_generation',
    text: t('in-aihub:gateways.createGateway.modelSelection.taskTypes.scriptGeneration')
  }
];

export type CapabilityKey = keyof typeof capabilityLabels;
