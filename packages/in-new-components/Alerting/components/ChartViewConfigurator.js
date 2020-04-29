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
  onTimeConfigChange
}) {
  const selectedTimeConfig = chartViewConfigs[indexInitialSelectedTimeConfig];
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
            buttonPropsList={chartViewConfigs.map(timeConfig => ({
              text: timeConfig.label,
              key: timeConfig.label,
              onClick: () => onTimeConfigChange(timeConfig)
            }))}
            activeKey={selectedTimeConfig.label}
          />
        }
        framed={framed}
        darkFrame
      >
        {children({
          timeConfig: createTimeConfigForWindowSize(selectedTimeConfig.windowSize),
          granularity: selectedTimeConfig.granularity
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
  onTimeConfigChange: PropTypes.func.isRequired
};
