/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { isAIHubView, aihubGatewaysFullyQualified } from 'in-aihub/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { aIGatewayEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function AIHubMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();
  if (!aIGatewayEnabled) return null;
  return (
    <MenuItem
      id="main-nav-aihub"
      label={t('in-components:mainNavigation.viewSwitcherLabelAiGateway')}
      icon="lib_ai_gateway"
      isActive={matchLocation(isAIHubView)}
      isBeta
      href={createHrefToPath(aihubGatewaysFullyQualified)}
    />
  );
}
