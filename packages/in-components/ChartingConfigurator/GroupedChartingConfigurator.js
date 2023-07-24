/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import GroupedMetricSelectorOverlay from 'in-components/ChartingConfigurator/GroupedMetricSelectorOverlay';
import ChartingConfiguratorForm from 'in-components/ChartingConfigurator/ChartingConfiguratorForm';
import ChartSelectorOverlay from 'in-components/ChartingConfigurator/ChartSelectorOverlay';

import locals from './GroupedChartingConfigurator.mless';

export default function GroupedChartingConfigurator({
  value,
  options,
  onChange,
  hideRenderer,
  disableClose,
  tracking,
  dataSource,
  unifiedMetricsSource
}) {
  const hasOptionsToSelect = Object.values(options).some(option => option?.length > 0);

  if (!value && !hasOptionsToSelect) {
    return null;
  }

  if (!value && hasOptionsToSelect) {
    return (
      <div className={locals.wrapper}>
      <ChartSelectorOverlay
          value={value}
          options={options}
          dataSource={dataSource}
          unifiedMetricsSource={unifiedMetricsSource}
          overlayContent={GroupedMetricSelectorOverlay}
          overlayProps={{ dataSource, unifiedMetricsSource }}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div className={locals.wrapper}>
      <ChartingConfiguratorForm
        value={value}
        options={options}
        onChange={chartConfig => {
          if (chartConfig != null) {
            tracking?.onChartChanged?.(chartConfig);
          } else {
            tracking?.onChartRemoved?.();
          }
          onChange(chartConfig);
        }}
        hideRenderer={hideRenderer}
        disableClose={disableClose}
        dataSource={dataSource}
        unifiedMetricsSource={unifiedMetricsSource}
      />
    </div>
  );
}
