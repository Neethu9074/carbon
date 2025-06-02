/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonIconButton, CarbonStack, SvgIcon } from '@instana/components';

import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import CreateNewPolicyTearsheet from 'in-automation/Policies/CreateNewPolicyTearsheet';
import { showConfirmationDialog } from 'in-automation/PolicyTable/PolicyTable';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Policy } from 'in-types';
import { t } from 'in-i18n';

export default function PolicyControls({ data }: { data: Policy }) {
  const navigsteToPolicies = useNavigateToPolicies();
  return (
    <CarbonStack orientation="horizontal">
      <CarbonIconButton
        label={t('in-automation:copy')}
        kind="ghost"
        size="sm"
        onClick={() => handleButtonClick({ policyId: data.id, copy: true })}
      >
        <SvgIcon type="lib_actions_copy" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton
        label={t('in-automation:edit')}
        kind="ghost"
        size="sm"
        onClick={() => handleButtonClick({ policyId: data.id })}
      >
        <SvgIcon type="lib_actions_edit" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton
        label={t('in-automation:delete')}
        kind="ghost"
        size="sm"
        onClick={() => showConfirmationDialog(data, { callback: navigsteToPolicies, disableRefresh: true })}
      >
        <SvgIcon type="lib_actions_delete" size="xs" />
      </CarbonIconButton>
    </CarbonStack>
  );
}

const handleButtonClick = ({ policyId, copy }: { policyId?: string; copy?: boolean }) => {
  addActiveDialog(<CreateNewPolicyTearsheet policyId={policyId} copy={copy} isFromDashboard />);
};
