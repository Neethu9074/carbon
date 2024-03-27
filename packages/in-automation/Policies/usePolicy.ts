/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { NewPolicy, PolicyFormEntity } from 'in-automation/Policies/types';
import { mapData, successObservable } from 'in-services/util/result';
import { getPolicy } from 'in-automation/api';
import { Result } from 'in-types';
import { t } from 'in-i18n';

function createPolicy() {
  const policy: NewPolicy = {
    name: 'New Policy',
    description: '',
    tags: [],
    trigger: {
      type: 'builtinEvent',
      id: ''
    },
    typeConfigurations: []
  };
  return policy;
}

export default function usePolicy(id: string | null, isCopy: boolean) {
  return resultToFetchedStateResponse(
    useObservable<Result<PolicyFormEntity>, []>(
      () =>
        id
          ? getPolicy(id).map(result =>
              mapData(result, policy =>
                isCopy ? { ...policy, name: t('in-automation:copyOf', { name: policy.name }) } : policy
              )
            )
          : successObservable(createPolicy()),
      []
    )
  );
}
