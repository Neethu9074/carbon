/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React, { ReactNode } from 'react';

import { CarbonModal } from '@instana/components';

import {
  ENTITY_TABLE_ACTIONS,
  ENTITY_TABLE_BATCH_ACTIONS,
  ENTITY_TABLE_HEADERS,
  ENTITY_TABLE_ORDER,
  ENTITY_TABLE_PAGE_SIZES
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/EntitiesDialog.constants';
import {
  createEntitiesForm,
  DefaultEntitiesFormFieldValues
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/EntitiesDialog.form';
import {
  SCOPE_FORM_ACTIONS,
  SCOPE_FORM_ID
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.constants';
import MultiSelectDataTable, { DataTableRow } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import MapFormProvider, { FormMode } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { close as closeModal } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useFormSubmission from 'in-hooks/useFormSubmission';
import useDerivedState from 'in-hooks/useDerivedState';
import { t } from 'in-i18n';

interface EntitiesDialogProps {
  mode: FormMode;
  formValues?: DefaultEntitiesFormFieldValues;
}

interface EntityRow<ROW_DATA> {
  id: string;
  name: ReactNode;
  rowData: ROW_DATA;
}

interface EntityOverview {
  readonly id: string;
  readonly name: string;
}

const createMenuItemsForRow = (
  entities: EntityOverview[],
  row: Omit<DataTableRow<EntityRow<EntityOverview>[], EntityOverview>, 'rowData'>
) => {
  const entity = entities.filter(item => item.id === row.id)[0];
  const { name } = entity;
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: name })
    }
  ];
};

const createTableRows = (entities: any[] = []): Array<EntityRow<EntityOverview>> => {
  return entities?.map((entity: any) => ({
    id: entity.id,
    name: entity?.name,
    rowData: { ...entity }
  }));
};

export default function EntitiesDialog({ mode, formValues }: EntitiesDialogProps) {
  const [form, setForm] = useDerivedState(createEntitiesForm(formValues));
  //@ts-expect-error actions not defined yet
  const [status, submitForm] = useFormSubmission(SCOPE_FORM_ACTIONS[mode]);

  function onSubmit() {
    if (!form.hierarchyValid) {
      // In case user clicks on save button and the form is in invalid state we
      // cancel the submission request and set the form to touched in order to
      // show validation messages to the user.
      return setForm(form.setTouched(true));
    }

    const payload = form.toJS();

    submitForm({
      payload,
      onError: () => {
        addMessage({
          type: 'danger',
          content: t('in-components:error.serverErrorInfo')
        });
      },
      onSuccess: () => {
        addMessage({
          type: 'success',
          content: t('in-settings:dialogs.scope.scopeSuccessfullySaved')
        });
        closeModal();
      }
    });
  }

  return (
    <MapFormProvider id={SCOPE_FORM_ID} form={form} mode={mode} updateForm={setForm}>
      <CarbonModal
        modalHeading={t('in-settings:dialogs.scope.title', { context: mode })}
        onRequestClose={closeModal}
        onRequestSubmit={onSubmit}
        onSecondarySubmit={closeModal}
        open
        primaryButtonDisabled={status === 'pending'}
        primaryButtonText={t('in-settings:tabs.save')}
        secondaryButtonText={t('in-settings:tabs.cancel')}
        size="lg"
      >
        <form>
          <MultiSelectDataTable
            getBatchActionItems={() => ENTITY_TABLE_BATCH_ACTIONS}
            getEntityName={({ name }) => t('in-settings:tabs.teams.teamWithName', { name: name })}
            getMenuItems={row => createMenuItemsForRow([], row)}
            initalSortConfig={ENTITY_TABLE_ORDER}
            labelNew={t('in-settings:tabs.newTeam')}
            loading={false}
            pageSizes={ENTITY_TABLE_PAGE_SIZES}
            searchAttributes={['name']}
            searchPlaceholderText={t('in-settings:components.search')}
            tableActions={ENTITY_TABLE_ACTIONS}
            tableHeaders={ENTITY_TABLE_HEADERS}
            tableRows={createTableRows([])}
            title={t('in-settings:tabs.teams.teamsTitle')}
          />
        </form>
      </CarbonModal>
    </MapFormProvider>
  );
}
