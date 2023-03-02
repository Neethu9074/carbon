/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Parameter } from '@instana/types';
import { Link } from '@instana/components';

import ServerTablePresenterWrapper from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ServerTablePresenterWrapper';
import ParameterDialog from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParameterDialog';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ActionTable.mless';

interface ParametersTableProps {
  form: MapForm;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetFormFunction;
}

export interface MappedParameter {
  id: string;
  value: Parameter;
}

const getColumnDefinitions = ({ form, onChange }: Omit<ParametersTableProps, 'setForm'>) => [
  {
    id: 'displayName',
    sortable: true,
    label: t('in-settings:tabs.displayName'),
    getContent(item: MappedParameter) {
      return (
        <Tooltip content={item.value.label} align="topLeft" delay={500}>
          <Link
            href=""
            className={locals.block}
            ellipsis
            onClick={e => {
              e.preventDefault();
              addActiveDialog(<ParameterDialog idToEdit={item.id} form={form} onChange={onChange} />);
            }}
          >
            {item.value.label}
          </Link>
        </Tooltip>
      );
    }
  },
  {
    id: 'name',
    sortable: true,
    label: t('in-settings:tabs.name'),
    getContent(item: MappedParameter) {
      return (
        <Tooltip content={item.value.name} align="topLeft" delay={500}>
          <span className={classNames(locals.ellipsis, locals.block)}>{item.value.name}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'description',
    sortable: false,
    label: t('in-settings:tabs.description'),
    getContent(item: MappedParameter) {
      return <div className={locals.fourLines}>{item.value.description}</div>;
    }
  },
  {
    id: 'type',
    sortable: true,
    width: '8',
    label: t('in-settings:tabs.type'),
    getContent(item: MappedParameter) {
      if (item.value.type === 'vault') {
        return t('in-settings:tabs.vault');
      } else if (item.value.type === 'static') {
        return t('in-settings:tabs.static');
      }
      return null;
    }
  }
];

export default function ParametersTable({ form, setForm, onChange }: ParametersTableProps) {
  const columnDefinitions = getColumnDefinitions({ form, onChange });
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;

  return (
    <ServerTablePresenterWrapper
      customAddRowLabel={t('in-settings:tabs.addParameter')}
      columnDefinitions={columnDefinitions}
      data={parameters}
      form={form}
      formKey="parameters"
      leftHeader={<Label>{t('in-settings:tabs.parameters')}</Label>}
      setForm={setForm}
      customAddRow={() => {
        addActiveDialog(<ParameterDialog form={form} onChange={onChange} />);
      }}
      noDataMessage={t('in-settings:tabs.noParametersConfigured')}
    />
  );
}
