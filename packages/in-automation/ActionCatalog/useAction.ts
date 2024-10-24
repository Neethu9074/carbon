/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ActionType, Field, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { mapData, successObservable } from 'in-services/util/result';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { createDocLinkField } from 'in-automation/utils/actionField';
import { pendingResult } from 'in-services/fixedObjects';
import { ACTION_TYPE } from 'in-automation/constants';
import { NewAction } from 'in-automation/types';
import { getAction } from 'in-automation/api';
import { t } from 'in-i18n';

function createAction(
  name: string = t('in-automation:newAction'),
  type: ActionType = ACTION_TYPE.DOC_LINK,
  description: string = '',
  fields: Field[] = [createDocLinkField('')],
  tags: string[] = []
): NewAction {
  return {
    name,
    type,
    description,
    fields,
    tags
  };
}

export default function useAction(id: string | null, isCopy: boolean) {
  return (
    useObservable<Result<ActionFormEntity>, [boolean, string | null]>(
      () =>
        id
          ? getAction(id).map(result =>
              mapData(result, policy =>
                isCopy ? { ...policy, name: t('in-automation:copyOf', { name: policy.name }) } : policy
              )
            )
          : successObservable(createAction()),
      [isCopy, id]
    ) ?? (pendingResult as Result<ActionFormEntity>)
  );
}
