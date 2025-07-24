/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { Application } from '@instana/types';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getApplication from 'in-applications/subscriptions/getApplication';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

export default function useApplication(applicationId: string): FetchedState<Application> {
  const result = useObservable(() => {
    if (isBlank(applicationId)) {
      return just(error<Application>([{ code: 'CLIENT', message: 'Application Id may not be blank' }]));
    }

    return getApplication({ id: applicationId });
  }, [applicationId]);
  return resultToFetchedStateResponse(result);
}
