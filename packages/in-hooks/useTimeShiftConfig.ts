/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useMemo } from 'react';

import { urlParameter, translateOffsetToTimeShiftConfig, TimeShiftOffset } from 'in-stores/time/shifting';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { TimeShift } from 'in-types';

const urlStateDefinition = {
  bind: [urlParameter]
};

interface State {
  timeShiftOffset: TimeShiftOffset;
}

export default function useTimeShiftConfig(): TimeShift {
  const timeConfig = useTimeConfig();
  const [{ timeShiftOffset }] = useUrlState<State>(urlStateDefinition);
  return useMemo(() => translateOffsetToTimeShiftConfig(timeShiftOffset, timeConfig), [timeShiftOffset, timeConfig]);
}
