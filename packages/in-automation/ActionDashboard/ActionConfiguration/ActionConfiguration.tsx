/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';

import { CarbonStack } from '@instana/components';

import CreateNewActionTearsheet, {
  CreateNewActionTearsheetProps,
  isNotEditableContext
} from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import CreateNewPolicyTearsheet, {
  CreateNewPolicyTearsheetProps
} from 'in-automation/Policies/CreateNewPolicyTearsheet';
import ActionConfigurationCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfigurationCard';
import ParameterDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ParameterDetailsCard';
import ActionDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionDetailsCard';
import ActionDashboardBreadcrumb from 'in-automation/ActionDashboard/ActionDashboardBreadcrumb';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { isAIAction } from 'in-automation/utils/action';
import { ACTION_TYPE } from 'in-automation/constants';
import Form from 'in-components/form/binding/Form';
import { Action, Nullish } from 'in-types';

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
  const [tearsheetProps, setTearsheetProps] = useState<CreateNewActionTearsheetProps>({ open: false });
  const [policyTearsheetProps, setPolicyTearsheetProps] = useState<CreateNewPolicyTearsheetProps>({ open: false });

  if (!data) return null;
  const showParametersSection = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(data.type);
  const isAIGeneratedAction = isAIAction(data);

  const toggleActionTearsheet = ({ actionId, copy }: { actionId?: string; copy?: boolean }) => {
    setTearsheetProps({ actionId, copy, open: true });
  };
  const togglePolicyTearsheet = (actionId: string) => {
    setPolicyTearsheetProps({ actionId, open: true });
  };

  return (
    <>
      <isNotEditableContext.Provider value>
        <ActionFormContext.Provider value={formValue}>
          <Form form={form} setForm={() => {}} onSubmit={() => {}}>
            <CarbonStack orientation="vertical" gap={5}>
              <ActionDashboardBreadcrumb />
              <ActionDetailsCard
                data={data}
                isAIGeneratedAction={isAIGeneratedAction}
                toggleActionTearsheet={toggleActionTearsheet}
                togglePolicyTearsheet={togglePolicyTearsheet}
              />
            </CarbonStack>
            <ActionConfigurationCard data={data} />
            {showParametersSection && <ParameterDetailsCard data={data} />}
          </Form>
        </ActionFormContext.Provider>
      </isNotEditableContext.Provider>
      <CreateNewActionTearsheet
        {...tearsheetProps}
        isFromDashboard
        closeHandler={() => {
          setTearsheetProps({ open: false });
        }}
      />
      <CreateNewPolicyTearsheet
        {...policyTearsheetProps}
        closeHandler={() => {
          setPolicyTearsheetProps({ open: false });
        }}
      />
    </>
  );
}
