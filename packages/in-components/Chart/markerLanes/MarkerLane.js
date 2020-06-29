import { combineLatest } from 'reactive-observables';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import createObjectCollectionStream from 'in-map/stores/ObjectCollectionStream';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { generateUniqueShortId } from 'in-services/util/id';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { applyTransform } from 'in-services/util/dom';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './MarkerLane.mless';

class MarkersLane extends React.Component {
  constructor(props) {
    super(props);

    this.domItems = createObjectCollectionStream();

    this.renderScheduler = new RenderScheduler(this);
    this.updateSubscription = combineLatest([this.renderScheduler.xScaleBackBuffer$, this.domItems.stream])
      .nextFrame()
      .subscribe(([xScale, domItems]) => {
        for (const { time, domItem } of domItems.values()) {
          const xPos = xScale.getRange(time);
          applyTransform(domItem, `translateX(${xPos}px)`);
        }
      });
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/prop-types
    this.renderScheduler.update(this.props.timeConfig, this.props.width);
  }

  componentWillUnmount() {
    this.renderScheduler.dispose();
    this.updateSubscription.dispose();
  }

  render() {
    return (
      <div className={locals.lane}>
        {this.props.events.map(eventData => (
          <Tooltip
            key={eventData.id ?? eventData.start}
            align="topMiddle"
            content={this.props.tooltipContent(eventData)}
          >
            <LaneItem
              time={eventData.start}
              add={this.domItems.add}
              remove={this.domItems.remove}
              iconType={this.props.iconType}
            />
          </Tooltip>
        ))}
        {this.props.labelVisible && (
          <div className={locals.laneLabel} style={{ [this.props.labelAlignment]: 0 }}>
            <div
              className={locals.laneLabelText}
              style={{
                [`padding${this.props.labelAlignment === 'left' ? 'Right' : 'Left'}`]: '8px'
              }}
            >
              {this.props.label}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function LaneItem({ time, add, remove, iconType }) {
  const domItemRef = useRef(null);

  useEffect(
    () => {
      const id = generateUniqueShortId();
      add(id, { domItem: domItemRef.current, time });
      return () => remove(id);
    },
    [time]
  );

  return (
    <div className={locals.laneItem} ref={domItemRef}>
      <SvgIcon size="xs" className={locals.marker} type={iconType} />
    </div>
  );
}

export default getElementDimensions(MarkersLane);

MarkersLane.propTypes = {
  timeConfig: propTypeTimeConfig.isRequired,
  labelVisible: PropTypes.bool,
  labelAlignment: PropTypes.oneOf(['left', 'right']).isRequired,
  tooltipContent: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired
};
