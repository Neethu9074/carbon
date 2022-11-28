/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import DummyServerTablePresenter, {
  ListItem
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import ParameterDialog from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParameterDialog';
import { OnEntityChange, SetForm } from 'in-settings/hooks/useEntityForm';
import { t } from 'in-i18n';

// import locals from './DummyServerTablePresenterConsumer.mless';
import { Parameter } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

interface ParametersTableProps {
  form: MapForm;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetForm;
}

const getColumnDefinitions = () => [
  {
    id: 'id',
    sortable: false,
    label: t('in-settings:tabs.name'),
    getContent(item: ListItem<Parameter>) {
      return item.value.name;
    }
  }
];

export default function ParametersTable({ form, setForm, onChange }: ParametersTableProps) {
  const columnDefinitions = getColumnDefinitions();
  const parameters = (form.get('parameters') as Field<Parameter[]>).value;

  return (
    <DummyServerTablePresenter<Parameter>
      customAddRowLabel={t('in-settings:tabs.addParameter')}
      columnDefinitions={columnDefinitions}
      data={parameters.map(parameter => ({ id: generateUniqueShortId(), value: parameter }))}
      form={form}
      formKey="parameters"
      setForm={setForm}
      customAddRow={() => {
        addActiveDialog(<ParameterDialog form={form} setForm={setForm} onChange={onChange} />);
      }}
      noDataMessage={t('in-settings:tabs.noParametersConfigured')}
    />
  );
}
