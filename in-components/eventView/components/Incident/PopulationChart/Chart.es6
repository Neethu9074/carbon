import React from 'react';

import TimeAxis from 'in-components/eventView/components/Incident/PopulationChart/TimeAxis';
import Events from 'in-components/eventView/components/Incident/PopulationChart/Events';
import getElementDimensions from 'in-hoc/getElementDimensions';
import {getEvent} from 'in-services/issueTracker';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';

import 'in-components/eventView/components/Incident/PopulationChart/Chart.less';


const block = 'in-event-view-detail-chart';
const rpt = React.PropTypes;

export default getElementDimensions(React.createClass({

  displayName: 'IncidentPopulationChart',

  scale: createScale(),

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
    const scale = this.scale;
    const width = this.props.width;
    if (width) {
      scale.setRangeTo(width);
    }
    scale.setDomainFrom(this.state.from);
    scale.setDomainTo(this.state.to);

    return (
      <div className={block}>
        <TimeAxis scale={scale} />
        <Events scale={scale} />
      </div>
    );
  },

  setupIncidentSubscription() {
    // dispose the old subscription because it's null or uses an old incidentId
    this.disposeIncidentSubscription();

    this.incidentSubscription = getEvent(this.props.incidentId).subscribe(incident => {
      if (incident) {
        this.setState({from: incident.get('start')});

        if (incident.get('state') === 'open') {
          this.setupServertimeSubscription();
        } else {
          this.disposeServertimeSubscription();
          this.setState({to: incident.get('end')});
        }
      }
    });
  },

  setupServertimeSubscription() {
    this.disposeServertimeSubscription();

    this.servertimeSubscription = serverTime$.subscribe(to => this.setState({to}));
  },

  disposeIncidentSubscription() {
    if (this.incidentSubscription) {
      this.incidentSubscription.dispose();
      this.incidentSubscription = null;
    }
  },

  disposeServertimeSubscription() {
    if (this.servertimeSubscription) {
      this.servertimeSubscription.dispose();
      this.servertimeSubscription = null;
    }
  }
}));
