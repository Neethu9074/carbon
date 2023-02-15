/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field } from 'formalistic';
import React from 'react';

import {
  ConfigureAssociatedActionsDialogProps,
  ConfigureAssociatedActionsDialogState
} from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import SelectListDialogContent, {
  SelectListDialogContentProps
} from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import ActionTable, {
  ActionTableProps
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
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
  return (
    <SelectListDialogContent
      listComponent={(...props) => <ScoredActionTable {...props} eventSpecification={eventSpecification} />}
      hiddenIds={(form.get('actionIds') as Field<string[]>).value}
      onSubmit={onSubmit}
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
      renderCustomFormActions={numberOfItems => (
        <DialogFooter
          onSecondaryActionClick={() => setSlideInViewVisible(false)}
          secondaryActionText={t('in-events:cancelButton')}
          renderCustomSaveAction={() => (
            <SaveButton type="submit" kind="create" disabled={!numberOfItems}>
              {numberOfItems
                ? t('in-settings:tabs.addNumberOfItemsAction', {
                    count: numberOfItems
                  })
                : t('in-settings:tabs.addActions')}
            </SaveButton>
          )}
        />
      )}
      pageSize={5}
      preventCloseOnSubmit
    />
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
