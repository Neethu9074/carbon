/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Action } from '@instana/types';

import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ActionFormEntity } from 'in-automation/ActionCatalog/Action';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import { isDocLink } from 'in-automation/ActionCatalog/shared';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface TestActionButtonProps {
  action: ActionFormEntity;
  form?: MapForm<any>;
  setForm?: SetFormFunction;
}
export default function TestActionButton({ action, form, setForm }: TestActionButtonProps) {
  return (
    <>
      {!isDocLink(action.type) && (
        <Tooltip content={t('in-automation:ActionCatalog.test')} delay={500}>
          <IconButton
            kind="primaryv2"
            buttonType="button"
            type={'lib_actions_play'}
            onClick={() => {
              if (form && setForm && !form!.hierarchyValid) {
                setForm(form.setTouched(true, { recurse: true }));
                return;
              }
              addActiveDialog(<RunActionDialog test action={action as Action} volatileId={{}} />);
            }}
          />
        </Tooltip>
      )}
    </>
  );
}
