/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CorrectionConfiguration } from '@instana/types';
import { Toggle } from '@instana/carbon';

import useToggleCorrectionConfiguration from 'in-service-levels/features/CorrectionWindows/hooks/useToggleCorrectionConfiguration';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

const meta = { productArea: productAreas.slo, pageName: pageNames.correction_windows };

interface StateColumnContentProps {
  item: CorrectionConfiguration;
}

export default function StateColumnContent({ item }: StateColumnContentProps) {
  const { active, name } = item;
  const [loading, setLoading] = useState(false);

  const toggleCorrectionConfiguration = useToggleCorrectionConfiguration(item, meta, () => setLoading(false));

  const onToggle = () => {
    setLoading(true);
    toggleCorrectionConfiguration();
  };

  return (
    <Toggle
      disabled={loading}
      hideLabel
      size="sm"
      labelText={
        active
          ? t('in-service-levels:correctionWindowsList.enabled')
          : t('in-service-levels:correctionWindowsList.disabled')
      }
      id={`${name}-state-toggle`}
      toggled={active}
      onToggle={onToggle}
    />
  );
}
