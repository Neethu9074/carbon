/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { HorizontalIndicator } from '@instana/components';
import { useObservable } from '@instana/hooks';

import RenderScheduler from 'in-components/Chart/RenderScheduler';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './MarkerLane.mless';

/*
 Adding a new LaneItem:
 If you want to add a completely new item which doesn't wrap around an existing one like "SingleMarkerLaneItem",
 you need to ensure that it provides the functions outlined below. Otherwise Showing overlays would not work
 because we need some hover data about the hovered item. For reference please have a look at component
 "SingleMarkerLaneItem".

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

class MarkersLaneRenderScheduler extends React.Component {
  constructor(props) {
    super(props);
    this.renderScheduler = new RenderScheduler(this);
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/prop-types
    this.renderScheduler.update(this.props.timeConfig, this.props.width);
    if (this.props.events?.length > 0) this.props?.onLaneHasMarkersToRender(true);
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
  TooltipContent,
  renderScheduler,
  labelAlignment,
  label,
  chartContentPosition,
  isClustered,
  LaneItem,
  HoverOverlay,
  SecondaryHoverOverlay,
  selectedEventData,
  laneLabelsVisible,
  isLoading,
  trackMarkerHoverEvent,
  ...remainingProps
}) {
  const { timeConfig, clusterSizeMillis } = remainingProps;
  const xScale = useObservable(renderScheduler.xScaleBackBuffer$.nextFrame(), [timeConfig.autoRefresh], {
    pure: !timeConfig.autoRefresh
  });
  const [hoveredEventData, setHoveredEventData] = useState(null);

  const clusterAreaWidth = xScale?.getRangeArea(clusterSizeMillis);

  return (
    <>
      <span className={locals.hoverAreaContainer}>
        {(hoveredEventData || selectedEventData) &&
          (() => {
            const eventDataTimestamp = hoveredEventData?.timestamp ?? selectedEventData.timestamp;
            const xPos = isClustered ? getXposCluster(eventDataTimestamp) : xScale?.getRange(eventDataTimestamp);
            const config = {
              xPos,
              fromXPos: Math.max(0, xPos - clusterAreaWidth / 2),
              toXPos: Math.min(xPos + clusterAreaWidth / 2, xScale.getRangeTo()),
              chartContentPosition,
              eventData: hoveredEventData ?? selectedEventData,
              xScale,
              clusterWidth: clusterAreaWidth,
              commonOverlayStyles: getCommonOverlayStyles({ chartContentPosition, ...remainingProps }),
              isClustered,
              ...remainingProps
            };
            return (
              <>
                {HoverOverlay && <HoverOverlay {...config} />}
                {SecondaryHoverOverlay && <SecondaryHoverOverlay {...config} />}
              </>
            );
          })()}
      </span>
      <div
        className={classNames({
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
              key={`${eventData.id ?? eventData.timestamp}`}
              content={
                TooltipContent ? (
                  <div>
                    <TooltipContent {...eventData} />
                  </div>
                ) : null
              }
            >
              <LaneItem
                xPos={xPos}
                onHover={s => {
                  setHoveredEventData(s);
                  trackMarkerHoverEvent?.(eventData);
                }}
                showIconForCluster={showIconForCluster}
                chartContentPosition={chartContentPosition}
                isClustered={isClustered}
                eventData={eventData}
                xScale={xScale}
                {...remainingProps}
              />
            </Tooltip>
          );
        })}
        {laneLabelsVisible && (
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
        <div className={locals.loadingIndicatorContainer}>
          <HorizontalIndicator progress={{ loading: isLoading }} />
        </div>
      </div>
    </>
  );

  function getXposCluster(timestamp) {
    return xScale?.getRange(timestamp) + clusterAreaWidth / 2 - remainingProps.chartBucketWidth / 2;
  }

  function getTooltipAlignmentForChartContentPosition(chartContentPosition) {
    if (chartContentPosition === 'pre') return 'topMiddle';
    if (chartContentPosition === 'post') return 'bottomMiddle';
  }
}

MarkersLane.propTypes = {
  timeConfig: propTypeTimeConfig.isRequired,
  labelAlignment: PropTypes.oneOf(['left', 'right']).isRequired,
  TooltipContent: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.number.isRequired
    })
  ).isRequired,
  chartContentPosition: PropTypes.oneOf(['pre', 'post']).isRequired,
  LaneItem: PropTypes.elementType.isRequired,
  HoverOverlay: PropTypes.elementType,
  chartBucketWidth: PropTypes.number,
  SecondaryHoverOverlay: PropTypes.elementType,
  laneLabelsVisible: PropTypes.bool,
  onLaneHasMarkersToRender: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  // Tracking
  trackMarkerHoverEvent: PropTypes.func
};

function getCommonOverlayStyles({ chartContentPosition, color }) {
  return {
    // setting zIndex to ensure the lanes added before the chart (1st in stacking order) will overlay the chart when hovered
    zIndex: chartContentPosition === 'pre' ? 1 : 'auto',
    color
  };
}

export const commonOverlayStylesPropType = PropTypes.shape({
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string
});

export default function MarkersLane(props) {
  const ref = useRef();
  return <div ref={ref}>{<MarkersLaneRenderScheduler {...props} width={ref.current?.offsetWidth} />}</div>;
}
