import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ButtonGroup from 'in-new-components/ButtonGroup/ButtonGroup';
import evaluateClassNames from 'in-services/util/classnames';
import LightCard from 'in-new-components/Card/LightCard';

import locals from './TimeConfigSelector.mless';

export default function TimeConfigSelector({
  configs = [],
  indexInitialSelectedTimeConfig = 0,
  children,
  className,
  title,
  headerTransparent,
  framed = false,
  onTimeConfigChange
}) {
  const [selectedTimeConfig, setSelectedTimeConfig] = useState(configs[indexInitialSelectedTimeConfig]);
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
            buttonPropsList={configs.map(timeConfig => ({
              text: timeConfig.label,
              key: timeConfig.label,
              onClick: () => {
                setSelectedTimeConfig(timeConfig);
                onTimeConfigChange?.(timeConfig);
              }
            }))}
            activeKey={selectedTimeConfig.label}
          />
        }
        framed={framed}
        darkFrame
      >
        {children({
          timeConfig: {
            to: null,
            focusedMoment: null,
            windowSize: selectedTimeConfig.windowSize,
            autoRefresh: false
          },
          granularity: selectedTimeConfig.granularity
        })}
      </LightCard>
    </>
  );
}

TimeConfigSelector.propTypes = {
  configs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      windowSize: PropTypes.number.isRequired,
      granularity: PropTypes.number.isRequired
    })
  ).isRequired,
  children: PropTypes.func.isRequired,
  indexInitialSelectedTimeConfig: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  onTimeConfigChange: PropTypes.func
};
