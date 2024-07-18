/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { getActionTags } from 'in-automation/api';
import { mapData } from 'in-services/util/result';

export default function useActionTags() {
  const result = useObservable(getActionTags, []) ?? (pendingResult as Result<{ tags: string[] }>);
  return mapData(result, ({ tags }) => [...tags].sort(compareIgnoreCase));
}
