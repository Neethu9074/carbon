/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Stack, StackItem } from '@instana/components';

import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import ButtonGroup from 'in-components/ButtonGroup';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

export default function ChartViewConfigurator({
  selectedChartViewConfigIndex = 0,
  children,
  className,
  doNotSetDefaultHeight,
  title,
  headerTransparent,
  framed = false,
  onChartViewConfigChange
}) {
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];

  return (
    <>
      <LightCard
        className={classNames(locals.container, {
          [className]: className, // className overrides everything
          [locals.defaultSize]: !className && !doNotSetDefaultHeight
        })}
        title={title}
        headerClassName={headerTransparent ? locals.headerTransparent : null}
        header={
          <ButtonGroup
            buttonPropsList={chartViewConfigs.map((chartConfig, index) => ({
              text: chartConfig.label,
              key: chartConfig.label,
              onClick: () => onChartViewConfigChange(index)
            }))}
            activeKey={selectedChartViewConfig.label}
          />
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
  selectedChartViewConfigIndex: PropTypes.number,
  className: PropTypes.string,
  doNotSetDefaultHeight: PropTypes.bool,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  onChartViewConfigChange: PropTypes.func.isRequired
};
