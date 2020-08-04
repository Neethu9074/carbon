import React, { useState } from 'react';
import PropTypes from 'prop-types';

import RenderScheduler from 'in-components/Chart/RenderScheduler';
import getElementDimensions from 'in-hoc/getElementDimensions';
import evaluateClassNames from 'in-services/util/classnames';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useObservable from 'in-hooks/useObservable';

import locals from './MarkerLane.mless';

/*
 Adding a new LaneItem:
 If you want to add a completely new item which doesn't wrap around an existing one like "SingleIconLaneItem",
 you need to ensure that it provides the functions outlined below. Otherwise Showing overlays would not work
 because we need some hover data about the hovered item. For reference please have a look at component
 "SingleIconLaneItem".

  onMouseEnter={e => {
    onHover?.({
      isHovered: true,
      timestamp: eventData.timestamp,
      iconConfig
    });
  }}

  onMouseLeave={e => {
    onHover?.({});
  }}
*/

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
  renderLaneItem,
  renderHoverOverlay,
  chartBucketWidth,
  renderSecondaryHoverOverlay,
  ...remainingProps
}) {
  const xScale = useObservable(renderScheduler.xScaleBackBuffer$.nextFrame(), [], { pure: false });
  const [{ isHovered, eventData: laneItemEventData, iconConfig: laneItemIconConfig }, setHoverState] = useState({});

  const clusterAreaWidth = xScale?.getRangeArea(remainingProps.clusterSizeMillis);

  return (
    <>
      <span className={locals.hoverAreaContainer}>
        {isHovered &&
          renderHoverOverlay({
            xPos: getXposCluster(laneItemEventData.timestamp),
            color: laneItemIconConfig.color,
            chartContentPosition,
            clusterWidth: clusterAreaWidth,
            ...remainingProps
          })}
        {isHovered &&
          renderSecondaryHoverOverlay?.({
            xPos: getXposCluster(laneItemEventData.timestamp),
            color: laneItemIconConfig.color,
            chartContentPosition,
            clusterWidth: clusterAreaWidth,
            eventData: laneItemEventData,
            xScale,
            ...remainingProps
          })}
      </span>
      <div
        className={evaluateClassNames({
          [locals.lane]: true,
          [locals.lanePostChart]: chartContentPosition === 'post'
        })}
      >
        {events.map(eventData => {
          const showIconForCluster = eventData?.count > 1;

          const xPos = isClustered ? getXposCluster(eventData.timestamp) : xScale?.getRange(eventData.timestamp);

          return (
            <Tooltip
              align={getTooltipAlignmentForChartContentPosition(chartContentPosition)}
              key={eventData.id ?? eventData.timestamp}
              content={tooltipContent(eventData)}
            >
              {renderLaneItem({
                xPos: xPos,
                onHover: s => setHoverState(s),
                showIconForCluster,
                chartContentPosition,
                isClustered,
                eventData,
                ...remainingProps
              })}
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

  function getXposCluster(timestamp) {
    return xScale?.getRange(timestamp) + clusterAreaWidth / 2 - chartBucketWidth / 2;
  }

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
      timestamp: PropTypes.number.isRequired
    })
  ).isRequired,
  chartContentPosition: PropTypes.oneOf(['pre', 'post']).isRequired,
  renderLaneItem: PropTypes.func.isRequired,
  renderHoverOverlay: PropTypes.func.isRequired,
  chartBucketWidth: PropTypes.number,
  renderSecondaryHoverOverlay: PropTypes.func
};

export default getElementDimensions(MarkersLane);
