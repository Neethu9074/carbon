/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import useActionFilter from 'in-automation/hooks/useActionFilter';
import { ACTION_TYPE } from 'in-automation/constants';

export default function useHasAccessToManual() {
  const actionFilter = useActionFilter();
  return actionFilter.data === 'all' ? true : actionFilter.data?.types.includes(ACTION_TYPE.MANUAL) ?? false;
}
