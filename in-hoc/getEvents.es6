import { combineLatest } from 'reactive-observables';
import rpt from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import { getEvent, getHealthInfoAtFocusedMoment } from 'in-stores/events';

export default function getEvents(ComposedComponent) {
  return createReactClass({
    displayName: 'getEvents hoc for ' + (ComposedComponent.displayName || ComposedComponent.name),

    propTypes: {
      snapshotId: rpt.string.isRequired
    },

    getInitialState() {
      return {
        events: null
      };
    },

    componentWillMount() {
      this.subscribe(this.props.snapshotId);
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.snapshotId !== nextProps.snapshotId) {
        this.subscribe(nextProps.snapshotId);
      }
    },

    subscribe(snapshotId) {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }

      // reset state
      this.setState(this.getInitialState());

      if (snapshotId) {
        this.subscription = getEventsForEntityAtFocusedMoment(snapshotId).subscribe(_events => {
          this.setState({
            events: _events.sort(
              (i1, i2) => i1.getIn(['problem', 'severity'], 0) - i2.getIn(['problem', 'severity'], 0)
            )
          });
        });
      }
    },

    componentWillUnmount() {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
    },

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  });
}

function getEventsForEntityAtFocusedMoment(snapshotId) {
  return getHealthInfoAtFocusedMoment(snapshotId).flatMap(healthInfo =>
    combineLatest(healthInfo.get('eventIds').toArray().map(getEvent))
  );
}
