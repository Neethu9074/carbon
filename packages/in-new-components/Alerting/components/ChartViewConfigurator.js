/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { PER_AP_SERVICE } from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import ChartSubEntitySelection from 'in-new-components/Alerting/components/ChartsServiceSwitcher';
import { maxChartViewTimeframe } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { chartViewConfigs } from 'in-new-components/Alerting/Chart/chartViewConfig';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import ButtonGroup from 'in-new-components/ButtonGroup/ButtonGroup';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import LightCard from 'in-new-components/Card/LightCard';
import Stack from 'in-new-components/layout/Stack';

import locals from './ChartViewConfigurator.mless';

export default function ChartViewConfigurator({
  selectedChartViewConfigIndex = 0,
  alertConfig,
  children,
  className,
  doNotSetDefaultHeight,
  title,
  headerTransparent,
  framed = false,
  onChartViewConfigChange
}) {
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  const [serviceId, setServiceId] = useState();
  const showEntitySelection = alertConfig?.evaluationType === PER_AP_SERVICE;
  return (
    <>
      <LightCard
        className={classNames(locals.container, {
          [className]: className, // className overrides everything
          [locals.defaultSize]: !showEntitySelection && !className && !doNotSetDefaultHeight,
          [locals.withSelection]: showEntitySelection && !className
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
          {showEntitySelection && (
            <StackItem>
              <HorizontalFlexWrapper>
                <span className={locals.labelWithGap}>Preview for Service:</span>
                <div className={locals.expanding}>
                  <ChartSubEntitySelection
                    serviceId={serviceId}
                    setServiceId={setServiceId}
                    alertConfigWithFormModel={alertConfig}
                    // use maximum possible timeframe, to have a stable list when switching between options
                    queryWindowSize={maxChartViewTimeframe}
                  />
                </div>
              </HorizontalFlexWrapper>
            </StackItem>
          )}
          <StackItem>{children(selectedChartViewConfig, serviceId)}</StackItem>
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
  alertConfig: PropTypes.shape({ evaluationType: PropTypes.string }),
  onChartViewConfigChange: PropTypes.func.isRequired
};
