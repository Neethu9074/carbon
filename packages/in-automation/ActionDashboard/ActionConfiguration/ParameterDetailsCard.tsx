/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonStack, CarbonTile, Typography } from '@instana/components';

import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import ParametersTable from 'in-automation/ActionCatalog/ParametersTable';
import { isNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import Form from 'in-components/form/binding/Form';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionDetailsCardProps {
  data: ActionFormEntity;
}

export default function ActionDetailsCard({ data }: ActionDetailsCardProps) {
  const [form] = useActionForm({ action: data, actionFilter: 'all' });
  if (!data?.inputParameters) return null;

  return (
    <CarbonTile>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">Parameter details</Typography>
      </CarbonStack>
      <Form form={form} setForm={() => {}} onSubmit={() => {}}>
        <isNotEditableContext.Provider value>
          <ParametersTable />
        </isNotEditableContext.Provider>
      </Form>
    </CarbonTile>
  );
}
