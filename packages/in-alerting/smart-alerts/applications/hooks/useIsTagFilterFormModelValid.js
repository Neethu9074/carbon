/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useIsTagFilterFormModelValid(tagFilterFormModel, isQueryValid, isTearSheet = false) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(
      ([tagFilterFormModel, timeConfig]) => isQueryValid(tagFilterFormModel, timeConfig),
      [tagFilterFormModel, timeConfig, isQueryValid]
    ) ?? pendingResult;

  if (isTearSheet) {
    if (result?.progress?.loading) {
      return;
    }
    return !!result?.data;
  }
  return !!result?.data;
}
