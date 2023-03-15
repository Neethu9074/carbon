/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Action } from '@instana/types';

import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import { isDocLink } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface TestActionButtonProps {
  action: ActionFormEntity;
  form?: MapForm;
  setForm?: SetFormFunction;
}
export default function TestActionButton({ action, form, setForm }: TestActionButtonProps) {
  return (
    <>
      {!isDocLink(action.type) && (
        <Tooltip content={t('in-settings:tabs.test')} delay={500}>
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
