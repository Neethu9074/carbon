/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import { Field } from 'formalistic';

import { Link, Typography } from '@instana/components';
import { ActionType, Parameter } from '@instana/types';

import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { isNotEditableContext, OnChange } from 'in-automation/ActionCatalog/Action';
import ParameterDialog from 'in-automation/ActionCatalog/ParameterDialog';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ACTION_TYPE } from 'in-automation/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

interface ParametersTableProps {
  form: ActionForm;
  onChange: OnChange;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}

export interface MappedParameter {
  id: string;
  value: Parameter;
}

const getColumnDefinitions = ({
  form,
  onChange,
  isNotEditable,
  isAnsible,
  ticketIdParameterExist
}: Omit<ParametersTableProps, 'setForm'> & {
  isNotEditable: boolean;
  isAnsible: boolean;
  ticketIdParameterExist: boolean;
}) => [
  {
    id: 'displayName',
    sortable: true,
    label: t('in-automation:ActionCatalog.displayName'),
    getContent(item: MappedParameter) {
      return (
        <Tooltip content={item.value.label} align="topLeft" delay={500}>
          <Link
            href=""
            ellipsis
            onClick={e => {
              e.preventDefault();
              addActiveDialog(
                <ParameterDialog
                  isAnsible={isAnsible}
                  idToEdit={item.id}
                  form={form}
                  onChange={onChange}
                  isNotEditable={isNotEditable}
                  isGitOrJira={ticketIdParameterExist}
                />
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
    label: t('in-automation:name'),
    getContent(item: MappedParameter) {
      return (
        <Tooltip content={item.value.name} align="topLeft" delay={500}>
          <Typography noWrap variant="body-regular">
            {item.value.name}
          </Typography>
        </Tooltip>
      );
    }
  },
  {
    id: 'description',
    sortable: false,
    label: t('in-automation:description'),
    getContent(item: MappedParameter) {
      return (
        <FourLineWrapper>
          <Typography variant="body-regular">{item.value.description}</Typography>
        </FourLineWrapper>
      );
    }
  },
  {
    id: 'type',
    sortable: true,
    width: '16',
    label: t('in-automation:type'),
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

// Note: Ansible actions will have extra vars mapped to parameters, we don't want to allow creating new parameters, but we do want to allow editing existing ones (minus the name as this is the key in the extra vars object)

export default function ParametersTable({ form, setForm, onChange }: ParametersTableProps) {
  const isNotEditable = useContext(isNotEditableContext);
  const type = (form.get('type') as Field<ActionType>).value;
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const isAnsible = type === ACTION_TYPE.ANSIBLE;
  const ticketIdParameterExist =
    [ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA].includes(type) &&
    parameters.some(param => param.value.name === 'id');
  const columnDefinitions = getColumnDefinitions({ form, onChange, isNotEditable, isAnsible, ticketIdParameterExist });

  return (
    <ServerTablePresenterWrapper
      customAddRowLabel={t('in-automation:ActionCatalog.addParameter')}
      columnDefinitions={columnDefinitions}
      data={parameters}
      form={form}
      formKey="parameters"
      leftHeader={<Label>{t('in-automation:ActionCatalog.parameters')}</Label>}
      setForm={setForm}
      ticketIdParameterExist={ticketIdParameterExist}
      customAddRow={
        isAnsible
          ? undefined
          : () => {
              addActiveDialog(
                <ParameterDialog
                  isAnsible={isAnsible}
                  isGitOrJira={ticketIdParameterExist}
                  form={form}
                  onChange={onChange}
                  isNotEditable={isNotEditable}
                />
              );
            }
      }
      noDataMessage={t('in-automation:ActionCatalog.noParametersConfigured')}
    />
  );
}
