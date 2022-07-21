/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';

export default function getTestResultListStatus(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return get(resultList.data?.items[0], ['metrics', 'status', 0, 1], 0);
}
