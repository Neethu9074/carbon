/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export * from '@instana/types';
export * from 'in-types/globals';
export * from 'in-types/utilities';

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

export interface Field {
  readonly description?: string;
  readonly encoding: string;
  readonly name: string;
  readonly value: string;
}

export interface Parameter {
  readonly name: string;
}

export interface ActionAIScore {
  action: Action;
  score: number;
}
