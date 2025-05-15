/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { isVulnerabilityView, vulnerabilityRoot } from 'in-vulnerability-center/navigation/paths';
import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { vulnerabilityCenterEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function VulnerabilitiesMenuItem() {
  const { createHrefToPath, matchLocation } = useNavigation();
  const { trackVulnerabilitiesInNavigation } = useVulnerabilityTracker();

  if (!vulnerabilityCenterEnabled) return null;

  return (
    <MenuItem
      id="main-nav-vul-dashboard"
      label={t('in-components:mainNavigation.viewVulnerabilityCenter')}
      icon="lib_events_cve"
      isActive={matchLocation(isVulnerabilityView)}
      onClick={trackVulnerabilitiesInNavigation}
      href={createHrefToPath(vulnerabilityRoot)}
    />
  );
}
