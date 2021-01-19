/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DefaultChartingConfigurator from 'in-new-components/ChartingConfigurator/ChartingConfigurator';
import Section from 'in-new-components/workspace/Section';

const noAdditionalActions = <></>;

export default function ChartingConfiguratorSection({
  value,
  options,
  onChange,
  hideRenderer,
  disableClose,
  ChartingConfigurator = DefaultChartingConfigurator,
  // Option to pass in additional buttons. For example to allow configuration of percentile presentation.
  additionalActions = noAdditionalActions
}) {
  return (
    <Section icon="lib_bar_chart" title="Chart" actions={<>{additionalActions}</>}>
      <ChartingConfigurator
        value={value}
        options={options}
        onChange={onChange}
        hideRenderer={hideRenderer}
        disableClose={disableClose}
      />
    </Section>
  );
}
