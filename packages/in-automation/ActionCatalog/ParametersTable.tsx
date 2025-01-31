/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link, Typography } from '@instana/components';

import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { ActionForm, MappedParameter } from 'in-automation/ActionCatalog/useActionForm/types';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/Action';
import ParameterDialog from 'in-automation/ActionCatalog/ParameterDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ACTION_TYPE } from 'in-automation/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

const getColumnDefinitions = ({
  form,
  isNotEditable,
  setForm,
  ticketIdParameterExist
}: {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  isNotEditable: boolean;
  ticketIdParameterExist: boolean;
}): ColumnDefinition<MappedParameter>[] => [
  {
    id: 'displayName',
    sortable: true,
    label: t('in-automation:ActionCatalog.displayName'),
    getContent(item) {
      return (
        <Tooltip content={item.value.label} align="topLeft" delay={500}>
          <Link
            href=""
            ellipsis
            onClick={e => {
              e.preventDefault();
              addActiveDialog(
                <ParameterDialog
                  id={item.id}
                  form={form}
                  setForm={setForm}
                  isNotEditable={isNotEditable}
                  ticketIdParameterExist={ticketIdParameterExist}
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
    getContent(item) {
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
    getContent(item) {
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
    getContent(item) {
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
export default function ParametersTable() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const type = form.get('type').value;
  const parameters = form.get('parameters').value;

  const ticketIdParameterExist =
    (type === ACTION_TYPE.GITHUB || type === ACTION_TYPE.GITLAB || type === ACTION_TYPE.JIRA) &&
    parameters.some(param => param.value.name === 'id');
  const columnDefinitions = getColumnDefinitions({ form, setForm, isNotEditable, ticketIdParameterExist });

  return (
    <ServerTablePresenterWrapper
      customAddRowLabel={t('in-automation:ActionCatalog.addParameter')}
      columnDefinitions={columnDefinitions}
      formKey="parameters"
      leftHeader={<Label>{t('in-automation:ActionCatalog.parameters')}</Label>}
      ticketIdParameterExist={ticketIdParameterExist}
      customAddRow={
        type === ACTION_TYPE.ANSIBLE
          ? undefined
          : () => {
              addActiveDialog(
                <ParameterDialog
                  setForm={setForm}
                  form={form}
                  isNotEditable={isNotEditable}
                  ticketIdParameterExist={ticketIdParameterExist}
                />
              );
            }
      }
      noDataMessage={t('in-automation:ActionCatalog.noParametersConfigured')}
    />
  );
}
