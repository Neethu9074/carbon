import PureRenderMixin from 'react-addons-pure-render-mixin';
import {create} from 'reactive-observables';
import Immutable from 'immutable';
import React from 'react';

import TimeAxis from 'in-components/eventView/components/eventDetails/IncidentPopulationChart/TimeAxis';
import Events from 'in-components/eventView/components/eventDetails/IncidentPopulationChart/Events';
import getElementDimensions from 'in-hoc/getElementDimensions';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';

import 'in-components/eventView/components/eventDetails/IncidentPopulationChart/IncidentPopulationChart.less';


const block = 'in-event-view-detail-chart';
const timeOffset = 1000 * 10;
const rpt = React.PropTypes;

export default getElementDimensions(React.createClass({

  displayName: 'IncidentPopulationChart',

  scale: createScale(),

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    incidentId: rpt.string.isRequired,
    height: rpt.number,
    width: rpt.number
  },

  getInitialState() {
    return {
      from: null,
      to: null
    };
  },

  componentDidMount() {
    this.setupIncidentSubscription();
  },

  componentWillUnmount() {
    this.disposeIncidentSubscription();
    this.disposeServertimeSubscription();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.incidentId !== this.props.incidentId) {
      this.setupIncidentSubscription();
    }
  },

  render() {
    const width = this.props.width;
    if (width) {
      this.scale.setRangeTo(width); // sub left and right padding caused by section component
    }
    this.scale.setRangeFrom(0);
    this.scale.setDomainFrom(this.state.from);
    this.scale.setDomainTo(this.state.to);

    return (
      <div className={block}>
        <TimeAxis scale={this.scale} />
        <Events scale={this.scale} />
      </div>
    );
  },

  setTo(to) {
    this.setState({to: to + timeOffset});
  },

  setFrom(from) {
    this.setState({from: from - timeOffset});
  },

  setupIncidentSubscription(/* incidentId*/) {
    this.disposeIncidentSubscription();

    // HACK FOR FAKE EVENTS
    // incidentSubscription = getEvent(incidentId).subscribe(event => {
    this.incidentSubscription = create().startWith(Immutable.fromJS({
      start: Date.now() - 1000 * 40 * 10
    })).subscribe(event => {
      if (event) {
        this.setFrom(event.get('start'));

        const end = event.get('end');
        if (end) {
          this.disposeServertimeSubscription();
          this.setTo(end);
        } else {
          this.setupServertimeSubscription();
        }
      }
    });
  },

  disposeIncidentSubscription() {
    if (this.incidentSubscription) {
      this.incidentSubscription.dispose();
      this.incidentSubscription = null;
    }
  },

  setupServertimeSubscription() {
    this.disposeServertimeSubscription();
    this.servertimeSubscription = serverTime$.subscribe(time => this.setTo(time));
  },

  disposeServertimeSubscription() {
    if (this.servertimeSubscription) {
      this.servertimeSubscription.dispose();
      this.servertimeSubscription = null;
    }
  }
}));
