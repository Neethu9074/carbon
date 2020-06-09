import PropTypes from 'prop-types';
import React from 'react';

import { chartViewConfigs } from 'in-new-components/Alerting/utils/timeConfigUtils';
import ButtonGroup from 'in-new-components/ButtonGroup/ButtonGroup';
import evaluateClassNames from 'in-services/util/classnames';
import LightCard from 'in-new-components/Card/LightCard';

import locals from './ChartViewConfigurator.mless';

export default function ChartViewConfigurator({
  selectedChartViewConfigIndex = 0,
  children,
  className,
  title,
  headerTransparent,
  framed = false,
  onChartViewConfigChange
}) {
  const selectedChartConfig = chartViewConfigs[selectedChartViewConfigIndex];
  return (
    <>
      <LightCard
        className={evaluateClassNames({
          [locals.container]: true,
          [className]: className
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
            activeKey={selectedChartConfig.label}
          />
        }
        framed={framed}
        darkFrame
      >
        {children({
          timeConfig: selectedChartConfig.timeConfig,
          minChartMetricGranularity: selectedChartConfig.minChartMetricGranularity
        })}
      </LightCard>
    </>
  );
}

ChartViewConfigurator.propTypes = {
  children: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  onChartViewConfigChange: PropTypes.func.isRequired
};
