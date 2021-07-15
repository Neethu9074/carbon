/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getApplication from 'in-subscription/application/getApplication';

export default function useApplicationsSubscriptions(applications) {
  const apIds = Object.keys(applications);
  const getAllApplication = combineLatest(apIds.map(id => getApplication({ id })));
  return useObservable(getAllApplication, [applications]);
}
