/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import {
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export interface NoAccessPanelProps {
  productArea: ProductAreaType;
  descriptionContext?: string;
}

export default function NoAccessPanel({ productArea, descriptionContext }: NoAccessPanelProps) {
  const { noAccessMessage } = getConfigurationSummaryMsg(productArea, ScopedPermissionItem.NO_ACCESS);
  return (
    <Stack direction="vertical">
      {applicationContributionFilterEnabled ? (
        <StackItem>
          <ConfigurationSummary noAccess noAccessMsg={noAccessMessage} />
        </StackItem>
      ) : (
        <StackItem>
          <Typography variant="heading-200" component="div">
            {t('in-settings:permissionScope.selection_no_access')}
          </Typography>
          <Typography variant="body-regular" component="div">
            {t('in-settings:permissionScope.description_no_access', { context: descriptionContext })}
          </Typography>
        </StackItem>
      )}
    </Stack>
  );
}
