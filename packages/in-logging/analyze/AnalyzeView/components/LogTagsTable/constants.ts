/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TagName, TagValue } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/Tag';

export const columnDefinitions = [
  {
    id: 'name',
    width: '15rem',
    getContent: TagName
  },
  {
    id: 'value',
    getContent: TagValue
  }
];
