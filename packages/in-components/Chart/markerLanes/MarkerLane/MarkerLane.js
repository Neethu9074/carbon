import React, { useState } from 'react';
import PropTypes from 'prop-types';

import RenderScheduler from 'in-components/Chart/RenderScheduler';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useObservable from 'in-hooks/useObservable';
import HoverLine from './HoverLine';
import HoverArea from './HoverArea';
import LaneItem from './LaneItem';

import locals from './MarkerLane.mless';

class MarkersLane extends React.Component {
  constructor(props) {
    super(props);
    this.renderScheduler = new RenderScheduler(this);
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/prop-types
    this.renderScheduler.update(this.props.timeConfig, this.props.width);
  }

  componentWillUnmount() {
    this.renderScheduler.dispose();
  }

  render() {
    return <MarkersLanePresenter {...this.props} renderScheduler={this.renderScheduler} />;
  }
}

function MarkersLanePresenter({
  events,
  tooltipContent,
  renderScheduler,
  labelVisible,
  labelAlignment,
  label,
  chartContentPosition,
  isClustered,
  timeAxisHeight,
  markerPaneHeight,
  iconConfig,
  chartHeight,
  ...remainingProps
}) {
  const xScale = useObservable(renderScheduler.xScaleBackBuffer$.nextFrame(), [], { pure: false });
  const [{ isHovered, startTime }, setHoverState] = useState({});

  const clusterWidth = xScale?.getRangeArea(remainingProps.clusterSizeMillis);

  return (
    <>
      <span style={{ display: 'block' }}>
        {isHovered && isClustered && (
          <HoverArea
            xPos={xScale?.getRange(startTime) + clusterWidth / 2}
            clusterWidth={clusterWidth}
            color={iconConfig.color}
            chartContentPosition={chartContentPosition}
            timeAxisHeight={timeAxisHeight}
            markerPaneHeight={markerPaneHeight}
            chartHeight={chartHeight}
          />
        )}
        {isHovered && !isClustered && <HoverLine xPos={xScale?.getRange(startTime)} color={iconConfig.color} />}
      </span>
      <div className={locals.lane}>
        {events.map(eventData => {
          const containsMoreThenOneItem = eventData?.count > 1;

          const xPos = isClustered
            ? xScale?.getRange(eventData.startTime) + clusterWidth / 2
            : xScale?.getRange(eventData.startTime);

          return (
            <Tooltip
              align={getTooltipAlignmentForChartContentPosition(chartContentPosition)}
              key={eventData.id ?? eventData.startTime}
              content={tooltipContent(eventData)}
            >
              <LaneItem
                xPos={xPos}
                startTime={eventData.startTime}
                containsMoreThenOneItem={containsMoreThenOneItem}
                chartContentPosition={chartContentPosition}
                isClustered={isClustered}
                onHover={s => setHoverState(s)}
                iconConfig={iconConfig}
                {...eventData}
                {...remainingProps}
              />
            </Tooltip>
          );
        })}
        {labelVisible && (
          <div className={locals.laneLabel} style={{ [labelAlignment]: 0 }}>
            <div
              className={locals.laneLabelText}
              style={{
                [`padding${labelAlignment === 'left' ? 'Right' : 'Left'}`]: '8px'
              }}
            >
              {label}
            </div>
          </div>
        )}
      </div>
    </>
  );

  function getTooltipAlignmentForChartContentPosition(chartContentPosition) {
    if (chartContentPosition === 'pre') return 'topMiddle';
    if (chartContentPosition === 'post') return 'bottomMiddle';
  }
}

MarkersLane.propTypes = {
  timeConfig: propTypeTimeConfig.isRequired,
  labelVisible: PropTypes.bool,
  labelAlignment: PropTypes.oneOf(['left', 'right']).isRequired,
  tooltipContent: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      count: PropTypes.number
    })
  ).isRequired,
  onClick: PropTypes.func,
  chartContentPosition: PropTypes.oneOf(['pre', 'post']).isRequired,
  timeAxisHeight: PropTypes.number.isRequired,
  markerPaneHeight: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired
};

export default getElementDimensions(MarkersLane);
