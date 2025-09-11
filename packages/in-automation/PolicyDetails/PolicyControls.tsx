/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonIconButton, CarbonStack, SvgIcon } from '@instana/components';
import { Policy } from '@instana/types';

import { CreatePolicyTearsheetProps } from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import { showConfirmationDialog } from 'in-automation/PolicyTable/PolicyTable';
import { t } from 'in-i18n';

export default function PolicyControls({
  data,
  tearsheetToggleHandler
}: {
  data: Policy;
  tearsheetToggleHandler?: (props: CreatePolicyTearsheetProps) => void;
}) {
  const navigsteToPolicies = useNavigateToPolicies();
  return (
    <CarbonStack orientation="horizontal">
      <CarbonIconButton
        label={t('in-automation:copy')}
        kind="ghost"
        size="sm"
        onClick={() => tearsheetToggleHandler?.({ policyId: data.id, copy: true })}
      >
        <SvgIcon type="lib_actions_copy" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton
        label={t('in-automation:edit')}
        kind="ghost"
        size="sm"
        onClick={() => tearsheetToggleHandler?.({ policyId: data.id })}
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
