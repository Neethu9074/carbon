import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import {event$} from './timelineStores';
import Line from './Line';
import Event from './Event';

import './Eventline.less';


const rpt = React.PropTypes;
const block = 'in-timeline-eventline';

export default connectTo({
    times: combineLatest([serverTimeStore.serverTime, timelineStore.timeframe])
            .map(([serverTime, timeframe]) => {
              return {
                serverTime,
                timeframe
              };
            }),
    events: event$,
    focusedMoment: timelineStore.focusedMoment
  },
  React.createClass({
    displayName: 'Eventline',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      times: rpt.shape({
        serverTime: rpt.number.isRequired,
        timeframe: timelineStore.timeframeShape.isRequired
      }),
      scale: rpt.func.isRequired,
      focusedMoment: rpt.number,
      events: irpt.list
    },

    getInitialState() {
      return {
        hoveredSnapshot: null,
        hoveredEvent: null
      };
    },

    render() {
      const times = this.props.times;
      if (!times) {
        return null;
      }

      return (
        <div className={block}>
          {this.renderEventLine()}
          {this.renderEvents()}
          {this.renderFocusedMoment()}
        </div>
      );
    },

    renderEventLine() {
      const event = this.state.hoveredEvent;
      if (!event) {
        return null;
      }

      return (
        <Line style={{left: this.props.scale(event.get('start')).toFixed(2) + '%'}}
                   event={event}
                   scale={this.props.scale}/>
      );
    },

    renderEvents() {
      const events = this.props.events;
      if (!events || events.size === 0) {
        return null;
      }

      const times = this.props.times;
      const maxOldestPermittedEventTimestamp =
        (times.timeframe.to ? times.timeframe.to : times.serverTime ) - times.timeframe.windowSize;
      const maxNewestTimeStamp = times.timeframe.to ? times.timeframe.to : Infinity;

      return events
        .filter(event => {
          const start = event.get('start');
          return start > maxOldestPermittedEventTimestamp &&
                 start < maxNewestTimeStamp;
        })
        .map(event => <Event key={event.get('id')}
                             mouseIn={this.mouseIn}
                             mouseOut={this.mouseOut}
                             event={event}
                             style={{
                               left: this.props.scale(event.get('start')).toFixed(2) + '%'
                             }}/>
        );
    },

    mouseIn(event) {
      this.setState({ hoveredEvent: event });

      setHighlightedEntityId(event.getIn(['problem', 'snapshotId']));
    },

    mouseOut() {
      this.setState({
        hoveredEvent: null
      });
      clearHighlightedEntityId();
    },

    renderFocusedMoment() {
      if (!this.props.focusedMoment) {
        return null;
      }

      return (
        <div className={block + '__focused-moment'}
             style={{
               left: this.props.scale(this.props.focusedMoment).toFixed(2) + '%'
             }}/>
      );
    }
  })
);
