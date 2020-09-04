import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { markerLaneLabelVisibleSignal$ } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import getElementDimensions from 'in-hoc/getElementDimensions';
import evaluateClassNames from 'in-services/util/classnames';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useObservable from 'in-hooks/useObservable';

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

const setHasMarkersToRenderSignalSrc$ = create();
export const hasMarkersToRenderSignal$ = setHasMarkersToRenderSignalSrc$.emit(false);

export function setHasMarkersToRenderSignal(hasMarkersToRender) {
  setHasMarkersToRenderSignalSrc$.emit(hasMarkersToRender);
}

class MarkersLane extends React.Component {
  constructor(props) {
    super(props);
    this.renderScheduler = new RenderScheduler(this);
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/prop-types
    this.renderScheduler.update(this.props.timeConfig, this.props.width);
    setHasMarkersToRenderSignal(this.props.events?.length > 0);
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
  labelAlignment,
  label,
  chartContentPosition,
  isClustered,
  renderLaneItem,
  renderHoverOverlay,
  chartBucketWidth,
  renderSecondaryHoverOverlay,
  color,
  selectedEventData,
  ...remainingProps
}) {
  const labelVisible = useObservable(markerLaneLabelVisibleSignal$, [label, labelAlignment]);
  const xScale = useObservable(renderScheduler.xScaleBackBuffer$.nextFrame(), [], { pure: false });
  const [hoveredEventData, setHoveredEventData] = useState(null);

  const clusterAreaWidth = xScale?.getRangeArea(remainingProps.clusterSizeMillis);

  return (
    <>
      <span className={locals.hoverAreaContainer}>
        {(hoveredEventData || selectedEventData) &&
          (() => {
            const xPos = getXposCluster(hoveredEventData?.timestamp ?? selectedEventData.timestamp);
            const config = {
              xPos,
              fromXPos: Math.max(0, xPos - clusterAreaWidth / 2),
              toXPos: Math.min(xPos + clusterAreaWidth / 2, xScale.getRangeTo()),
              chartContentPosition,
              eventData: hoveredEventData ?? selectedEventData,
              color,
              xScale,
              clusterWidth: clusterAreaWidth,
              ...remainingProps
            };
            return (
              <>
                {renderHoverOverlay?.(config)}
                {renderSecondaryHoverOverlay?.(config)}
              </>
            );
          })()}
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
                xPos,
                onHover: s => setHoveredEventData(s),
                showIconForCluster,
                chartContentPosition,
                isClustered,
                eventData,
                xScale,
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
  renderHoverOverlay: PropTypes.func,
  chartBucketWidth: PropTypes.number,
  renderSecondaryHoverOverlay: PropTypes.func
};

export default getElementDimensions(MarkersLane);
