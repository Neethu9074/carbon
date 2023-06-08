/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field } from 'formalistic';
import React, { useContext } from 'react';
import classNames from 'classnames';

import { Parameter } from '@instana/types';
import { Link } from '@instana/legacy';

import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { ActionFormEntity, isNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import ParameterDialog from 'in-automation/ActionCatalog/ParameterDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ActionTable.mless';

interface ParametersTableProps {
  form: MapForm<any>;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetFormFunction;
}

export interface MappedParameter {
  id: string;
  value: Parameter;
}

const getColumnDefinitions = ({
  form,
  onChange,
  isNotEditable
}: Omit<ParametersTableProps, 'setForm'> & { isNotEditable: boolean }) => [
  {
    id: 'displayName',
    sortable: true,
    label: t('in-automation:ActionCatalog.displayName'),
    getContent(item: MappedParameter) {
      return (
        <Tooltip content={item.value.label} align="topLeft" delay={500}>
          <Link
            href=""
            className={locals.block}
            ellipsis
            onClick={e => {
              e.preventDefault();
              addActiveDialog(
                <ParameterDialog idToEdit={item.id} form={form} onChange={onChange} isNotEditable={isNotEditable} />
              );
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
    label: t('in-automation:ActionCatalog.name'),
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
    label: t('in-automation:ActionCatalog.description'),
    getContent(item: MappedParameter) {
      return <div className={locals.fourLines}>{item.value.description}</div>;
    }
  },
  {
    id: 'type',
    sortable: true,
    width: '8',
    label: t('in-automation:ActionCatalog.type'),
    getContent(item: MappedParameter) {
      if (item.value.type === 'vault') {
        return t('in-automation:vault');
      } else if (item.value.type === 'static') {
        return t('in-automation:static');
      } else if (item.value.type === 'dynamic') {
        return t('in-automation:dynamic');
      }
      return null;
    }
  }
];

export default function ParametersTable({ form, setForm, onChange }: ParametersTableProps) {
  const isNotEditable = useContext(isNotEditableContext);
  const columnDefinitions = getColumnDefinitions({ form, onChange, isNotEditable });
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;

  return (
    <ServerTablePresenterWrapper
      customAddRowLabel={t('in-automation:ActionCatalog.addParameter')}
      columnDefinitions={columnDefinitions}
      data={parameters}
      form={form}
      formKey="parameters"
      leftHeader={<Label>{t('in-automation:ActionCatalog.parameters')}</Label>}
      setForm={setForm}
      customAddRow={() => {
        addActiveDialog(<ParameterDialog form={form} onChange={onChange} isNotEditable={isNotEditable} />);
      }}
      noDataMessage={t('in-automation:ActionCatalog.noParametersConfigured')}
    />
  );
}
