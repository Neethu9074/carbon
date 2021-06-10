/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DefaultChartingConfigurator from 'in-new-components/ChartingConfigurator/ChartingConfigurator';
import Section from 'in-new-components/workspace/Section';
import { t } from 'in-i18n';

const noAdditionalActions = <></>;

export default function ChartingConfiguratorSection({
  value,
  options,
  onChange,
  hideRenderer,
  disableClose,
  ChartingConfigurator = DefaultChartingConfigurator,
  // Option to pass in additional buttons. For example to allow configuration of percentile presentation.
  additionalActions = noAdditionalActions,
  tracking
}) {
  return (
    <Section
      icon="lib_bar_chart"
      title={t('in-components:chartingConfigurator.titleChart')}
      actions={<>{additionalActions}</>}
    >
      <ChartingConfigurator
        value={value}
        options={options}
        onChange={onChange}
        hideRenderer={hideRenderer}
        disableClose={disableClose}
        tracking={tracking}
      />
    </Section>
  );
}
