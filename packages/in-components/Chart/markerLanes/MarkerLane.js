import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { propTypeTimeConfig } from 'in-stores/time/config';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useObservable from 'in-hooks/useObservable';

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
  ...remainingProps
}) {
  const xScale = useObservable(renderScheduler.xScaleBackBuffer$.nextFrame(), [], { pure: false });

  return (
    <div className={locals.lane}>
      {events.map(eventData => {
        const clusterWidth = xScale?.getRangeArea(remainingProps.clusterSizeMillis);
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
              time={eventData.startTime}
              containsMoreThenOneItem={containsMoreThenOneItem}
              chartContentPosition={chartContentPosition}
              clusterWidth={clusterWidth}
              isClustered={isClustered}
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
  );

  function getTooltipAlignmentForChartContentPosition(chartContentPosition) {
    if (chartContentPosition === 'pre') return 'topMiddle';
    if (chartContentPosition === 'post') return 'bottomMiddle';
  }
}

function LaneItem({
  xPos,
  iconConfig,
  onClick,
  onHover,
  clusterWidth,
  chartContentPosition,
  containsMoreThenOneItem,
  isClustered
}) {
  return (
    <div
      style={{ transform: `translateX(${xPos}px)` }}
      className={locals.laneItem}
      onMouseEnter={e => {
        stopPropagationAndPreventDefault(e);
        onHover?.({
          overlayVisible: isClustered,
          lineVisible: !isClustered,
          color: iconConfig.color,
          width: clusterWidth,
          chartContentPosition,
          xPos
        });
      }}
      onMouseLeave={e => {
        stopPropagationAndPreventDefault(e);
        onHover?.({});
      }}
    >
      <SvgIcon
        size="xs"
        className={locals.marker}
        onClick={onClick}
        type={containsMoreThenOneItem ? iconConfig.typeCluster : iconConfig.type}
        color={iconConfig.color}
      />
    </div>
  );
}

MarkersLane.propTypes = {
  timeConfig: propTypeTimeConfig.isRequired,
  labelVisible: PropTypes.bool,
  labelAlignment: PropTypes.oneOf(['left', 'right']).isRequired,
  tooltipContent: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  iconConfig: PropTypes.shape({
    type: PropTypes.string.isRequired,
    typeCluster: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      count: PropTypes.number
    })
  ).isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  chartContentPosition: PropTypes.oneOf(['pre', 'post']).isRequired
};

export default getElementDimensions(MarkersLane);
