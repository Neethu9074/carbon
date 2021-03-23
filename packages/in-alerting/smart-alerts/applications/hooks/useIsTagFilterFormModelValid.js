/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { isAlertQueryValid } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useIsTagFilterFormModelValid(tagFilterFormModel) {
  const timeConfig = useTimeConfig();
  const result = useObservable(args => isAlertQueryValid(args), [tagFilterFormModel, timeConfig]) ?? pendingResult;
  return !!result?.data;
}
