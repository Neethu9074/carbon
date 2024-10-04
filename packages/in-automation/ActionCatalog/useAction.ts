/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ActionType, Field, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { DOC_LINK_TYPE, ActionFormEntity } from 'in-automation/ActionCatalog/shared';
import { NewAction, createDocLinkField, getAction } from 'in-automation/api';
import { mapData, successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

function createAction(
  name: string = t('in-automation:newAction'),
  type: ActionType = DOC_LINK_TYPE,
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
