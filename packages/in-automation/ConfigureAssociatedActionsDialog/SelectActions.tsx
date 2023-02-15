/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer } from '@instana/components';

import {
  ConfigureAssociatedActionsDialogProps,
  ConfigureAssociatedActionsDialogState
} from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import SelectListDialogContent, {
  SelectListDialogContentProps
} from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { getActionsFromForm } from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogWrapper';
import ActionTable, {
  ActionTableProps
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { getAllActionsWithAISuggestions } from 'in-automation/api';
import SaveButton from 'in-components/form/SaveButton';
import { t } from 'in-i18n';

type ConfigureSelectedActionsProps = Pick<ConfigureAssociatedActionsDialogProps, 'form' | 'eventSpecification'> &
  Pick<SelectListDialogContentProps, 'onSubmit'> & {
    setSlideInViewVisible: ConfigureAssociatedActionsDialogState['setSlideInViewVisible'];
  };

export default function ConfigureSelectedActions({
  form,
  eventSpecification,
  onSubmit,
  setSlideInViewVisible
}: ConfigureSelectedActionsProps) {
  const selectedActions = getActionsFromForm(form).value;
  return (
    <LeftRightPadding>
      <SelectListDialogContent
        listComponent={props => <ScoredActionTable {...props} eventSpecification={eventSpecification} />}
        hiddenIds={selectedActions}
        onSubmit={onSubmit}
        requiresAtLeastOneMessage={t('in-automation:pleaseSelectAtLeastOneAction')}
        renderCustomFormActions={numberOfItems => (
          <DialogFooter
            onSecondaryActionClick={() => setSlideInViewVisible(false)}
            secondaryActionText={t('common:forms.actions.cancel')}
            renderCustomSaveAction={() => (
              <SaveButton type="submit" kind="create" disabled={!numberOfItems}>
                {numberOfItems
                  ? t('in-automation:addNumberOfItemsAction', {
                      count: numberOfItems
                    })
                  : t('in-automation:addActions')}
              </SaveButton>
            )}
          />
        )}
        pageSize={5}
        preventCloseOnSubmit
      />
      <Spacer vertical="xxlarge" />
    </LeftRightPadding>
  );
}

function ScoredActionTable({
  eventSpecification,
  ...props
}: Omit<ActionTableProps, 'loadEntities'> & Pick<ConfigureAssociatedActionsDialogProps, 'eventSpecification'>) {
  return (
    <ActionTable
      {...props}
      pageSize={5}
      loadEntities={() => getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '')}
      scored
    />
  );
}
