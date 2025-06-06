/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ReactNode } from 'react';

import { TagFilterExpressionElementUnion, Widget } from '@instana/types';

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
