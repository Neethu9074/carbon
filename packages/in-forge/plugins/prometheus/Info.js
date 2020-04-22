import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const counters = snapshot.getIn(['data', 'metrics.counters'], emptyList).size;
  const gauges = snapshot.getIn(['data', 'metrics.gauges'], emptyList).size;
  const histograms = snapshot.getIn(['data', 'metrics.histograms'], emptyList).size;
  const summaries = snapshot.getIn(['data', 'metrics.summaries'], emptyList).size;

  return (
    <DescriptionList>
      <DescriptionItem title="Counters">{counters}</DescriptionItem>
      <DescriptionItem title="Gauges">{gauges}</DescriptionItem>
      <DescriptionItem title="Histograms">{histograms}</DescriptionItem>
      <DescriptionItem title="Summaries">{summaries}</DescriptionItem>
    </DescriptionList>
  );
}
