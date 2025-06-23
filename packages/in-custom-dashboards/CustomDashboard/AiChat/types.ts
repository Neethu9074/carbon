/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ReactNode } from 'react';

import { TagFilterExpressionElementUnion, Widget } from '@instana/types';

/** enum keys should be the format of backend-compatible chart types */
export enum PromptableWidgetType {
  bigNumber = 'Big number',
  TIME_SERIES = 'Time series chart',
  slo2 = 'SLO'
}

export enum IsLoadingCounterType {
  INCREASE = 'increase',
  DECREASE = 'decrease'
}

export interface ChatMessage {
  type: 'user' | 'system';
  content: ReactNode;
}

export type CommonFinalConfig = {
  metric: string;
  aggregation: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
};

export type SLOFinalConfig = {
  sloId: string;
  name: string;
};

export interface FinalConfig {
  widgetType: string;
  config: CommonFinalConfig | SLOFinalConfig;
}

export type CreateWidgetResponse = {
  widgetConfig: Widget;
};

export type CommonInferredConfig = {
  metric?: string | null;
  aggregation?: string | null;
  filter?: Record<string, any> | null;
};

export type SLOInferredConfig = {
  sloId?: string | null;
  name?: string | null;
};

export type InferredSlotConfig = {
  widgetType: 'bigNumber' | 'TIME_SERIES' | 'slo2' | null;
  config?: CommonInferredConfig | SLOInferredConfig | null;
};

export type CommonPossibleConfig = {
  metrics?: string[] | null;
  aggregations?: string[] | null;
  filters?: Record<string, string[]> | null;
};

export type SLOPossibleConfig = {
  sloIds?: string[] | null;
  names?: string[] | null;
};

export type SloSuggestion = {
  sloId: string;
  name: string;
};

export type PossibleSlotConfig = {
  widgetTypes?: string[] | null;
  config?: CommonPossibleConfig | SLOPossibleConfig;
};

export type SlotsResponse = {
  inferredSlotConfig: InferredSlotConfig;
  possibleSlotConfig?: PossibleSlotConfig | null;
};

export enum UserDefinedType {
  /**
   * used for a slots response after the LLM service inferred the possible widget configurations.
   */
  SLOTS = 'slots',
  /**
   * used for giving the user examples in the welcome message.
   */
  EXAMPLES = 'examples'
}

export type PromptExample = {
  id: string;
  /** text that will be passed to the backend request */
  text: string;
  /** user-friendly version of the text to emphasize replacable entities */
  node: JSX.Element;
};

export type ChatButtonOption = {
  key: keyof typeof PromptableWidgetType;
  value: string;
};
