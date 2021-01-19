/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useMemo } from 'react';

import { urlParameter, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [urlParameter]
};

export default function useTimeShiftConfig() {
  const timeConfig = useTimeConfig();
  const [{ timeShiftOffset }] = useUrlState(urlStateDefinition);
  return useMemo(() => translateOffsetToTimeShiftConfig(timeShiftOffset, timeConfig), [timeShiftOffset, timeConfig]);
}
