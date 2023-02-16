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
import ActionTable, {
  ActionTableProps
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { getActionsFromForm } from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import { getScoredActionsForEvent } from 'in-api/automation';
import { t } from 'in-i18n';

import locals from './ConfigureAssociatedActionsDialog.mless';

type SelectActionsProps = Pick<
  ConfigureAssociatedActionsDialogContentProps,
  'form' | 'setForm' | 'eventSpecification'
> &
  Pick<ConfigureAssociatedActionsDialogContentState, 'setSlideInViewVisible'>;

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
      loadEntities={() => getScoredActionsForEvent(selectedActions, eventSpecification)}
      pageSize={5}
      scored
      tableActions={getTableActions(setForm)}
      rightHeader={<RightHeader setSlideInViewVisible={setSlideInViewVisible} />}
    />
  );
}

function getTableActions(setForm: SelectActionsProps['setForm']) {
  return {
    deselect: {
      deselect: deselectedAction => {
        setForm(form =>
          form.updateIn(['actionIds'], field =>
            (field as Field<string[]>)
              .setValue((field as Field<string[]>).value.filter(referencedId => referencedId !== deselectedAction.id))
              .setTouched(true)
          )
        );
      }
    }
  } as ActionTableProps['tableActions'];
}

type RightHeaderProps = Pick<SelectActionsProps, 'setSlideInViewVisible'>;
function RightHeader({ setSlideInViewVisible }: RightHeaderProps) {
  return (
    <>
      <Button kind="action" onClick={() => setSlideInViewVisible(true)} icon="lib_openclose_add_circle_outline">
        {t('in-automation:addActions')}
      </Button>
      <Spacer horizontal="xsmall" />
    </>
  );
}
