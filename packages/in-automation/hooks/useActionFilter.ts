/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { ActionFilter, getActionFilter } from 'in-automation/api';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { role } from 'in-stores/user';

export default function useActionFilter() {
  return (
    useObservable<Result<'all'> | Result<ActionFilter>, []>(() => {
      if (!role?.limitedAutomationScope) return successObservable('all');
      return getActionFilter();
    }, []) ?? (pendingResult as Result<ActionFilter>)
  );
}
