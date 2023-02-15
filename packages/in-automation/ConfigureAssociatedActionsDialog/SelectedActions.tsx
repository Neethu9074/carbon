/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';
import { Spacer } from '@instana/components';

import {
  ConfigureAssociatedActionsDialogContentProps,
  ConfigureAssociatedActionsDialogContentState
} from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogContent';
import { getActionsFromForm } from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { getScoredActionsForEvent } from 'in-automation/api';
import { t } from 'in-i18n';

import locals from './ConfigureAssociatedActionsDialog.mless';

interface SelectActionsProps
  extends Pick<ConfigureAssociatedActionsDialogContentProps, 'form' | 'setForm' | 'eventSpecification'> {
  setSlideInViewVisible: ConfigureAssociatedActionsDialogContentState['setSlideInViewVisible'];
}

export default function SelectedActions({
  form,
  setForm,
  setSlideInViewVisible,
  eventSpecification
}: SelectActionsProps) {
  const selectedActions = getActionsFromForm(form).value;

  return (
    <ActionTable
      className={locals.actionTable}
      noDataMessage={t('in-automation:noActionsSelected')}
      loadEntities={() => getScoredActionsForEvent(eventSpecification)(selectedActions)}
      pageSize={5}
      scored
      tableActions={{
        deselect: {
          deselect: deselectedAction => {
            setForm(
              form.updateIn(['actionIds'], field =>
                (field as Field<string[]>)
                  .setValue(
                    (field as Field<string[]>).value.filter(referencedId => referencedId !== deselectedAction.id)
                  )
                  .setTouched(true)
              )
            );
          }
        }
      }}
      rightHeader={
        <>
          <Button kind="action" onClick={() => setSlideInViewVisible(true)} icon="lib_openclose_add_circle_outline">
            {t('in-automation:addActions')}
          </Button>
          <Spacer horizontal="xsmall" />
        </>
      }
    />
  );
}
