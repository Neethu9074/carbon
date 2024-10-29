/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, StackItem } from '@instana/components';

import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import {
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';

export interface NoAccessPanelProps {
  productArea: ProductAreaType;
}

export default function NoAccessPanel({ productArea }: NoAccessPanelProps) {
  const { noAccessMessage } = getConfigurationSummaryMsg(productArea, ScopedPermissionItem.NO_ACCESS);
  return (
    <Stack direction="vertical">
      <StackItem>
        <ConfigurationSummary noAccess noAccessMsg={noAccessMessage} />
      </StackItem>
    </Stack>
  );
}
