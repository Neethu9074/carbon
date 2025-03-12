/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';

import ActionConfigurationCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfigurationCard';
import ParameterDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ParameterDetailsCard';
import ActionDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionDetailsCard';
import { isNotEditableContext } from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { isAIAction } from 'in-automation/utils/action';
import { ACTION_TYPE } from 'in-automation/constants';
import Form from 'in-components/form/binding/Form';
import { Nullish, Action } from 'in-types';

interface ActionConfigurationProps {
  data: Action | Nullish;
}

export default function ActionConfiguration({ data }: ActionConfigurationProps) {
  const [form] = useActionForm({ action: data as ActionFormEntity, actionFilter: 'all' });
  const formValue = useMemo(
    () => ({
      form,
      rootPath: [],
      setForm: () => {}
    }),
    [form]
  );
  if (!data) return null;
  const showParametersSection = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(data.type);
  const isAIGeneratedAction = isAIAction(data);

  return (
    <isNotEditableContext.Provider value>
      <ActionFormContext.Provider value={formValue}>
        <Form form={form} setForm={() => {}} onSubmit={() => {}}>
          <ActionDetailsCard data={data} isAIGeneratedAction={isAIGeneratedAction} />
          <ActionConfigurationCard data={data} />
          {showParametersSection && <ParameterDetailsCard data={data} />}
        </Form>
      </ActionFormContext.Provider>
    </isNotEditableContext.Provider>
  );
}
