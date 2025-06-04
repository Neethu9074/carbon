/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Link, Typography } from '@instana/components';

import { toViewModel } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import DynamicTagBasedPayloadConfigurator from 'in-automation/components/DynamicTagBasedPayloadConfigurator';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { MappedParameter } from 'in-automation/ActionCatalog/useActionForm/types';
import ParameterDialog from 'in-automation/ActionCatalog/ParameterDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { DynamicFieldValue, ParameterValue } from 'in-types';
import { safeParseJSON } from 'in-automation/utils/json';
import { ACTION_TYPE } from 'in-automation/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

interface ExtendedMappedParameter extends MappedParameter {
  name: string;
}

const getColumnDefinitions = ({
  setOpenDialog,
  setSelectedId,
  parameterNewValues = null
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  parameterNewValues?: ParameterValue[] | null;
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
              setSelectedId(item.id);
              setOpenDialog(true);
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
  ...(parameterNewValues
    ? [
        {
          id: 'value',
          sortable: false,
          label: t('in-automation:value'),
          getContent(item: ExtendedMappedParameter) {
            if (item.value.type === 'dynamic') {
              const parsedDynamicValue: DynamicFieldValue | {} = safeParseJSON(item.value.value);
              return <DynamicTagBasedPayloadConfigurator value={toViewModel(parsedDynamicValue)} disabled />;
            }
            const value = parameterNewValues.find(param => param.name === item.value.name)?.value ?? item.value.value;
            if (item.value.type === 'vault') {
              const parsedDynamicValue: DynamicFieldValue | {} = safeParseJSON(value);
              return (
                <div>
                  {Object.entries(parsedDynamicValue).map(([key, val]) => (
                    <div key={key}>
                      <Typography variant="body-regular">
                        <strong>{key}:</strong> {val}
                      </Typography>
                    </div>
                  ))}
                </div>
              );
            }
            return value;
          }
        }
      ]
    : []),
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

interface ParametersTableProps {
  isAnsibleParameter?: boolean;
  hideHiddenParams?: boolean;
  parameterNewValues?: ParameterValue[] | null;
}

// Note: Ansible actions will have extra vars mapped to parameters, we don't want to allow creating new parameters, but we do want to allow editing existing ones (minus the name as this is the key in the extra vars object)
export default function ParametersTable({
  isAnsibleParameter = false,
  hideHiddenParams = false,
  parameterNewValues = null
}: ParametersTableProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const type = form.get('type').value;
  const parameters = form.get('parameters').value;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const ticketIdParameterExist =
    (type === ACTION_TYPE.GITHUB || type === ACTION_TYPE.GITLAB || type === ACTION_TYPE.JIRA) &&
    parameters.some(param => param.value.name === 'id');
  const columnDefinitions = getColumnDefinitions({
    setOpenDialog,
    setSelectedId,
    parameterNewValues
  });

  return (
    <>
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
                setOpenDialog(true);
                setSelectedId(null);
              }
        }
        noDataMessage={t('in-automation:ActionCatalog.noParametersConfigured')}
        hideHiddenParams={hideHiddenParams}
      />

      {/* Render the SidePanel separately */}
      {openDialog && (
        <ParameterDialog
          setForm={setForm}
          form={form}
          isNotEditable={isNotEditable}
          id={selectedId === null ? undefined : selectedId}
          ticketIdParameterExist={ticketIdParameterExist}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onRequestToClose={handleCloseDialog}
          isAnsibleParameter={isAnsibleParameter}
        />
      )}
    </>
  );
}
