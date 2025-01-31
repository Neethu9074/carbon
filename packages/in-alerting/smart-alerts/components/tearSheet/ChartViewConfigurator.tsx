/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack, StackItem } from '@instana/components';
import { ButtonGroup } from '@instana/components';

import {
  ChartViewConfigItem,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/ChartViewConfigurator.mless';

export interface ChartViewConfiguratorProps {
  children: (config: ChartViewConfigItem) => React.ReactNode;
  selectedChartViewConfigIndex?: number;
  chartViewConfigs?: readonly ChartViewConfigItem[];
  className?: string;
  doNotSetDefaultHeight?: boolean;
  title?: string;
  headerTransparent?: boolean;
  framed?: boolean;
  onChartViewConfigChange?: (index: number) => void;
  darkFrame?: boolean;
}

export default function ChartViewConfigurator({
  selectedChartViewConfigIndex = 0,
  chartViewConfigs = defaultChartViewConfigs,
  children,
  onChartViewConfigChange
}: ChartViewConfiguratorProps) {
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  const isSingleConfig = chartViewConfigs?.length === 1;
  return (
    <Stack gap="normal">
      <Stack direction="horizontal" gap="normal">
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.websites.tearSheet.alertChart.title')}
          description={t('in-alerting:smartAlerts.websites.tearSheet.alertChart.description')}
          hideSpace
        />
        <>
          {isSingleConfig && <label className={locals.singleChartViewConfig}>{chartViewConfigs[0].label}</label>}
          {!isSingleConfig && (
            <ButtonGroup
              buttonPropsList={chartViewConfigs.map((chartConfig, index) => ({
                text: chartConfig.label,
                key: chartConfig.label,
                onClick: () => (onChartViewConfigChange ? onChartViewConfigChange(index) : undefined)
              }))}
              activeKey={selectedChartViewConfig.label}
            />
          )}
        </>
      </Stack>

      <StackItem>
        <div className={locals.chartWrapper}>{children(selectedChartViewConfig)}</div>
      </StackItem>
    </Stack>
  );
}
