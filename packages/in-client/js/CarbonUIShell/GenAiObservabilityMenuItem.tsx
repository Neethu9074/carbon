/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { genAiObservability } from 'in-gen-ai-observability/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { genAiObservabilityEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function GenAIObservabilityMenuItem() {
  if (!genAiObservabilityEnabled) return null;

  const { createHrefToPath, matchLocation } = useNavigation();

  return (
    <MenuItem
      id="main-nav-gen-ai-dashboard"
      label={t('in-components:mainNavigation.viewSwitcherLabelGenAiObservability')}
      icon="lib_infra_ai"
      isActive={matchLocation(genAiObservability)}
      href={createHrefToPath(genAiObservability)}
    />
  );
}
