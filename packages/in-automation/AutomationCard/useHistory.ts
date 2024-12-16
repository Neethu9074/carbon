/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { create, timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import { GetActionInstanceListData } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

const refreshSignal = create().emit(true);
export function refreshHistory() {
  timeout(1000).once(() => refreshSignal.emit(true));
}

export default function useActionHistoryCount({
  eventId,
  types,
  actionStatuses
}: {
  eventId?: string;
  types?: string[];
  actionStatuses?: string[];
}) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(
      () => refreshSignal.flatMap(() => GetActionInstanceListDataFunc({ timeConfig, eventId, types, actionStatuses })),
      [timeConfig]
    ) ?? pendingResult;

  return result?.data?.totalHits;
}

interface GetActionInstanceListDataParams {
  timeConfig: TimeConfig;
  eventId?: string;
  types?: string[];
  actionStatuses?: string[];
}

function GetActionInstanceListDataFunc({
  timeConfig,
  eventId,
  types,
  actionStatuses
}: GetActionInstanceListDataParams) {
  return GetActionInstanceListData({
    timeConfig,
    eventId,
    types: types ?? [],
    actionStatuses: actionStatuses ?? []
  }).startWith(pendingResult);
}
