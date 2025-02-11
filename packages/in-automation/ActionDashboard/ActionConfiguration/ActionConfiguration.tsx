/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Action } from '@instana/types';

import ActionConfigurationCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfigurationCard';
import ParameterDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ParameterDetailsCard';
import ActionDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionDetailsCard';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { isNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { ACTION_TYPE } from 'in-automation/constants';
import Form from 'in-components/form/binding/Form';
import { Nullish } from 'in-types';

interface ActionConfigurationProps {
  data: Action | Nullish;
}

export default function ActionConfiguration({ data }: ActionConfigurationProps) {
  const [form] = useActionForm({ action: data as ActionFormEntity, actionFilter: 'all' });
  if (!data) return null;
  const showParametersSection = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(data.type);

  return (
    <Form form={form} setForm={() => {}} onSubmit={() => {}}>
      <isNotEditableContext.Provider value>
        <ActionDetailsCard data={data} />
        <ActionConfigurationCard data={data} />
        {showParametersSection && <ParameterDetailsCard data={data} />}
      </isNotEditableContext.Provider>
    </Form>
  );
}
