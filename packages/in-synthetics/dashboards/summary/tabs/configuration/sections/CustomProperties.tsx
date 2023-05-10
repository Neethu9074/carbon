/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

const CustomProperties = () => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.customProperties')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <h1>Custom Properties Section</h1>
    </ExpandableLightCard>
  );
};

export default CustomProperties;
