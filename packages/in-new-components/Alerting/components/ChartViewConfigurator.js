import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { chartViewConfigs } from 'in-new-components/Alerting/Chart/chartViewConfig';
import ButtonGroup from 'in-new-components/ButtonGroup/ButtonGroup';
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
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  return (
    <>
      <LightCard
        className={classNames({
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
            activeKey={selectedChartViewConfig.label}
          />
        }
        framed={framed}
        darkFrame
      >
        {children(selectedChartViewConfig)}
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
