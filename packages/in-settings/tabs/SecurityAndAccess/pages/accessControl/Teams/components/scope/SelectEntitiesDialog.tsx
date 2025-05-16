/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Modal } from '@instana/carbon';

import {
  ENTITY_TABLE_ACTIONS,
  ENTITY_TABLE_HEADERS,
  ENTITY_TABLE_ORDER,
  ENTITY_TABLE_PAGE_SIZES
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesDialog.constants';
import {
  ExtractFunction,
  SelectEntitiesDialogProps,
  SelectEntitiesRow
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesDialog.types';
import { createEntitiesForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesDialog.form';
import MultiSelectDataTable, { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import MapFormProvider, { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { close as closeModal } from 'in-components/DialogPresenter/store';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useDerivedState from 'in-hooks/useDerivedState';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './SelectEntitiesDialog.mless';

const createTableRows = <I,>(
  extractId: ExtractFunction<I>,
  extractName: ExtractFunction<I>,
  entities: I[] = []
): Array<SelectEntitiesRow<I>> => {
  return entities?.map(entity => ({
    id: extractId(entity),
    name: extractName(entity),
    rowData: { ...entity }
  }));
};

const SELECT_ENTITIES_FORM_ID = 'rbac-select-entities-form';
const SELECTED_IDS_FIELD_NAME = 'selectedIds';

const SelectEntitiesDialog = <I,>({
  extractId,
  extractName,
  observable,
  onSelected,
  preselectedIds = [],
  title
}: SelectEntitiesDialogProps<I>) => {
  const [form, setForm] = useDerivedState(createEntitiesForm(preselectedIds));
  const selectedIdsField = form.getIn([SELECTED_IDS_FIELD_NAME]);
  const dataTableResult = useObservable(observable, []) ?? pendingResult;
  const loading = isLoading(dataTableResult);
  const hasErrors = hasError(dataTableResult);
  const errorMessage: Notification | undefined = hasErrors
    ? {
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: dataTableResult.errors[0].message,
        kind: 'error',
        timeout: seconds.toMillis(6)
      }
    : undefined;

  const onRowSelect = (selectedIds: string[]) => {
    const newSelectedIds = selectedIdsField.value.concat(selectedIds);
    setForm(form.updateIn([SELECTED_IDS_FIELD_NAME], f => f.setValue(newSelectedIds).setTouched(true)));
  };

  const onSubmit = () => {
    const { selectedIds } = form.toJS();
    onSelected(selectedIds);

    closeModal();
  };

  const filterSelectableEntities = (entities: any) => {
    if (!loading) {
      return entities.filter((entity: any) => !preselectedIds.includes(extractId(entity)));
    } else {
      return pendingResult.data;
    }
  };

  return (
    <MapFormProvider id={SELECT_ENTITIES_FORM_ID} form={form} mode={FORM_MODE.EDIT} updateForm={setForm}>
      <Modal
        className={locals.selectEntitiesDialog}
        modalHeading={title}
        onRequestClose={closeModal}
        onRequestSubmit={onSubmit}
        onSecondarySubmit={closeModal}
        open
        primaryButtonDisabled={loading}
        primaryButtonText={t('in-settings:dialogs.selectEntities.doneButton')}
        secondaryButtonText={t('in-settings:tabs.cancel')}
        size="lg"
      >
        <form className={locals.selectEntitiesTable}>
          <MultiSelectDataTable
            getEntityName={({ name }) => name}
            getMenuItems={() => []}
            initalSortConfig={ENTITY_TABLE_ORDER}
            labelNew={''}
            loading={loading}
            message={errorMessage}
            onRowSelect={onRowSelect}
            pageSizes={ENTITY_TABLE_PAGE_SIZES}
            searchAttributes={['name']}
            searchPlaceholderText={t('in-settings:components.search')}
            tableActions={ENTITY_TABLE_ACTIONS}
            tableHeaders={ENTITY_TABLE_HEADERS}
            tableRows={createTableRows(extractId, extractName, filterSelectableEntities(dataTableResult.data))}
            title={title}
          />
        </form>
      </Modal>
    </MapFormProvider>
  );
};

export default SelectEntitiesDialog;
