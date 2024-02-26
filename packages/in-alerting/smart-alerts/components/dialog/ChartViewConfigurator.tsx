/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Stack, StackItem } from '@instana/components';

import {
  ChartViewConfigItem,
  chartViewConfigPropType,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import ButtonGroup from 'in-components/ButtonGroup';

import locals from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator.mless';

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
}

export default function ChartViewConfigurator({
  selectedChartViewConfigIndex = 0,
  chartViewConfigs = defaultChartViewConfigs,
  children,
  className,
  doNotSetDefaultHeight,
  title,
  headerTransparent,
  framed = false,
  onChartViewConfigChange
}: ChartViewConfiguratorProps) {
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  const isSingleConfig = chartViewConfigs?.length === 1;
  return (
    <>
      <LightCard
        className={classNames(locals.container, {
          [className as any]: className, // className overrides everything
          [locals.defaultSize]: !className && !doNotSetDefaultHeight
        })}
        title={title}
        headerClassName={headerTransparent ? locals.headerTransparent : undefined}
        header={
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
        }
        framed={framed}
        darkFrame
      >
        <Stack>
          <StackItem>{children(selectedChartViewConfig)}</StackItem>
        </Stack>
      </LightCard>
    </>
  );
}

ChartViewConfigurator.propTypes = {
  children: PropTypes.func.isRequired,
  chartViewConfigs: PropTypes.arrayOf(chartViewConfigPropType),
  selectedChartViewConfigIndex: PropTypes.number,
  className: PropTypes.string,
  doNotSetDefaultHeight: PropTypes.bool,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  onChartViewConfigChange: PropTypes.func.isRequired
};
