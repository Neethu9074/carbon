/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagCatalog, TagFilter } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export function translateDemocratisationTagFiltersToFormModel({
  websiteLabel,
  tagFilters,
  tagCatalog
}: {
  websiteLabel?: string;
  tagFilters: TagFilter[];
  tagCatalog: TagCatalog;
}): FormModelElement;
