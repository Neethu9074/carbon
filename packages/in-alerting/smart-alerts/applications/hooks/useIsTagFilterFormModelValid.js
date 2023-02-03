/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useIsTagFilterFormModelValid(tagFilterFormModel, isQueryValid) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(([tagFilterFormModel, timeConfig]) => isQueryValid(tagFilterFormModel, timeConfig), [
      tagFilterFormModel,
      timeConfig,
      isQueryValid
    ]) ?? pendingResult;
  return !!result?.data;
}
