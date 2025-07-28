/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getActionFilter } from 'in-automation/api';
import { ActionFilter } from 'in-automation/types';

export default function useActionFilter() {
  const [role] = useCurrentUserRole();
  return (
    useObservable<Result<'all'> | Result<ActionFilter>, []>(() => {
      if (!role.limitedAutomationScope) return successObservable('all' as const);
      return getActionFilter();
    }, []) ?? (pendingResult as Result<ActionFilter>)
  );
}
