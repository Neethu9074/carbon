/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

export type MappedValue<VALUE> = { id: string; value: VALUE };

export type ConnectionFormItems = {
  agentType: Field<string>;
  watsonxKey: Field<string>;
  watsonxProject: Field<string>;
  watsonxUrl: Field<string>;
  endpointUrl: Field<string>;
  endpointApiKey: Field<string>;
};

export type ModelSelectionFormItems = {
  taskType: Field<string>;
  modelType: Field<string>;
};

export type ModelConfigurationFormItems = {
  tokenLimit: Field<number>;
  maxLatency: Field<number>;
  repetitionPenalty: Field<number>;
  temperature: Field<number>;
  topK: Field<number>;
  topP: Field<number>;
};

export type DetailsFormItems = {
  name: Field<string>;
  description: Field<string>;
  // instanaAgents: Field<string[]>;
};

export type GatewayFormItems = {
  connection: MapForm<ConnectionFormItems>;
  modelSelection: MapForm<ModelSelectionFormItems>;
  modelConfiguration: MapForm<ModelConfigurationFormItems>;
  details: MapForm<DetailsFormItems>;
};

export type GatewayForm = MapForm<GatewayFormItems>;

export interface GatewayPayload {
  name: string;
  description: string;
  aiModel: string;
  watsonxKey?: string;
  watsonxProject?: string;
  watsonxUrl?: string;
  endpointUrl?: string;
  endpointApiKey?: string;
  supports: {
    capabilities: string[];
  };
  metadata: {
    source: string;
    version: string;
  };
  configurations?: {
    tokenLimit: number;
    maxLatency: number;
    repetitionPenalty: number;
    temperature: number;
    topK: number;
    topP: number;
  };
  id?: string;
}
