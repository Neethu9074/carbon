/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { green } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function ShowCase() {
  return (
    <KpiCard
      title={t('in-custom-dashboards:widgets.topList.index.topListLb')}
      value="12.34"
      companionValue={<Badge colorId={green.id}>+43.21%</Badge>}
      raw
      useMaxAvailableHeight={false}
      bigNumbers
    />
  );
}
