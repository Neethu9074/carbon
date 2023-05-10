/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

const LocationSection = () => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.locationsTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <h1>Settings Section</h1>
    </ExpandableLightCard>
  );
};

export default LocationSection;
