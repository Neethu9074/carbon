/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApdexConfigurationById } from 'in-custom-dashboards/widgets/Apdex/api';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

export default function useApdexConfiguration(id: string): FetchedState<ApdexConfiguration> {
  const result = useObservable(() => {
    if (isBlank(id)) {
      return just(
        error<ApdexConfiguration>([{ code: 'CLIENT', message: 'Apdex Id may not be blank' }])
      );
    }
    return getApdexConfigurationById(id);
  }, [id]);
  return resultToFetchedStateResponse(result);
}
