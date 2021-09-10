/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function MetricTypes({ snapshot }) {
  const counters = countMetrics(snapshot, 'metrics.counters');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.domino.counters')}>{counters}</DescriptionItem>
    </DescriptionList>
  );
}

function countMetrics(snapshot, prefix) {
  const metricCount = snapshot.get('metricIds', emptyList).filter(m => m.startsWith(prefix)).size;

  if (metricCount > 0) {
    return metricCount;
  }

  return snapshot.getIn(['data', prefix], emptyList).size;
}
