/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { mapData, successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getAction } from 'in-automation/api';
import { t } from 'in-i18n';

interface UseActionParams {
  id: string | null;
  isCopy: boolean;
}

export default function useAction({ id, isCopy }: UseActionParams) {
  return (
    useObservable<Result<ActionFormEntity | undefined>, [boolean, string | null]>(
      () =>
        id
          ? getAction(id).map(result =>
              mapData(result, action =>
                isCopy ? { ...action, name: t('in-automation:copyOf', { name: action.name }) } : action
              )
            )
          : successObservable(undefined),
      [isCopy, id]
    ) ?? (pendingResult as Result<ActionFormEntity>)
  );
}
