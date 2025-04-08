/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';

import { ActionType, Parameter } from '@instana/types';

import { AuthenType } from 'in-automation/types';

export type MappedValue<VALUE> = { id: string; value: VALUE };

export type MappedParameter = MappedValue<Parameter>;

export type MappedHeader = MappedValue<[string, string]>;

export type MappedString = MappedValue<string>;

type ActionFormItems = {
  name: Field<string>;
  description: Field<string>;
  type: Field<ActionType>;
  tags: Field<string[]>;
  parameters: Field<MappedParameter[]>;
  timeout: Field<string>;
  docLink: Field<string>;
  manualContent: Field<string>;
  script: Field<string>;
  subtype: Field<string>;
  httpBody: Field<string>;
  method: Field<string>;
  body: Field<string>;
  host: Field<string>;
  ignoreCertErrors: Field<boolean>;
  authType: Field<AuthenType>;
  contentType: Field<string>;
  accept: Field<string>;
  acceptLanguage: Field<string>;
  additionalHeaders: Field<MappedHeader[]>;
  username: Field<string>;
  password: Field<string>;
  bearerToken: Field<string>;
  apiKey: Field<string>;
  apiKeyValue: Field<string>;
  apiKeyAddTo: Field<string>;
  owner: Field<string>;
  repo: Field<string>;
  ticketActionType: Field<string>;
  title: Field<string>;
  labels: Field<MappedString[]>;
  assignees: Field<MappedString[]>;
  comment: Field<string>;
  project: Field<string>;
  projectId: Field<string>;
  issue_type: Field<string>;
  assignee: Field<string>;
  summary: Field<string>;
  git_url: Field<string>;
  scriptFromUrl: Field<string>;
};

export type ActionForm = MapForm<ActionFormItems>;
