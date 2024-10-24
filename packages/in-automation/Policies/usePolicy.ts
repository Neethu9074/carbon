/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Policy, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { mapData, successObservable } from 'in-services/util/result';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { pendingResult } from 'in-services/fixedObjects';
import { NewPolicy } from 'in-automation/types';
import { getPolicy } from 'in-automation/api';
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
  return (
    useObservable<Result<PolicyFormEntity>, [boolean, string | null]>(
      () =>
        id
          ? getPolicy(id).map(result =>
              mapData(result, policy =>
                isCopy ? { ...policy, name: t('in-automation:copyOf', { name: policy.name }) } : policy
              )
            )
          : successObservable(createPolicy()),
      [isCopy, id]
    ) ?? (pendingResult as Result<Policy>)
  );
}
