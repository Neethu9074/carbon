/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export * from '@instana/types';
export * from 'in-types/globals';
export * from 'in-types/utilities';

export interface ActionAIScore {
  action: Action;
  score: number;
}

export interface Action {
  readonly createdAt: Date;
  readonly description?: string;
  readonly fields?: Field[];
  readonly id: string;
  readonly modifiedAt: Date;
  readonly name: string;
  readonly parameters?: Parameter[];
  readonly type: string;
  readonly tags: string[];
  score?: number;
}
