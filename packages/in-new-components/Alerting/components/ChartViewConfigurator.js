import PropTypes from 'prop-types';
import React from 'react';

import { createTimeConfigForWindowSize } from 'in-new-components/Alerting/utils/timeConfigUtils';
import { chartViewConfigs } from 'in-new-components/Alerting/utils/timeConfigUtils';
import ButtonGroup from 'in-new-components/ButtonGroup/ButtonGroup';
import evaluateClassNames from 'in-services/util/classnames';
import LightCard from 'in-new-components/Card/LightCard';

import locals from './ChartViewConfigurator.mless';

export default function ChartViewConfigurator({
  indexInitialSelectedTimeConfig = 0,
  children,
  className,
  title,
  headerTransparent,
  framed = false,
  onChartConfigChange
}) {
  const selectedChartConfig = chartViewConfigs[indexInitialSelectedTimeConfig];
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
              onClick: () => onChartConfigChange({ ...chartConfig, index })
            }))}
            activeKey={selectedChartConfig.label}
          />
        }
        framed={framed}
        darkFrame
      >
        {children({
          timeConfig: createTimeConfigForWindowSize(selectedChartConfig.windowSize),
          granularity: selectedChartConfig.granularity
        })}
      </LightCard>
    </>
  );
}

ChartViewConfigurator.propTypes = {
  children: PropTypes.func.isRequired,
  indexInitialSelectedTimeConfig: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  onChartConfigChange: PropTypes.func.isRequired
};
