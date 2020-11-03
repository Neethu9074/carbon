import rpt from 'prop-types';
import React from 'react';

import TimeAxis from 'in-events/components/legacy/PopulationChart/TimeAxis';
import Events from 'in-events/components/legacy/PopulationChart/Events';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { serverTime$ } from 'in-stores/serverTime';
import { getEvent } from 'in-stores/events';
import createScale from 'in-services/scale';

import 'in-events/components/legacy/PopulationChart/Chart.less';

const block = 'in-event-view-detail-chart';

/**
 * We show the timeframe of the incident in the chart, plus some buffer time before the incident, to ensure
 * correlated issues are always visible. The correlation timeframe in the backend is 3 minutes.
 */
const correlationTimeBuffer = 3 * 60 * 1000;

export default getElementDimensions(
  class extends React.Component {
    static displayName = 'IncidentPopulationChart';

    scale = createScale();

    static propTypes = {
      changesAreVisible: rpt.bool.isRequired,
      incidentId: rpt.string.isRequired,
      isExpanded: rpt.bool.isRequired,
      recentEvents: rpt.array,
      width: rpt.number
    };

    state = {
      from: null,
      to: null
    };

    componentDidMount() {
      this.setupIncidentSubscription();
    }

    componentWillUnmount() {
      this.disposeIncidentSubscription();
      this.disposeServertimeSubscription();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.incidentId !== this.props.incidentId) {
        this.setupIncidentSubscription();
      }
    }

    render() {
      const scale = this.scale;
      const width = this.props.width;
      if (width) {
        scale.setRangeTo(width);
      }

      const from = this.state.from - correlationTimeBuffer;
      const now = Date.now();
      const to = Math.min(this.state.to, now);
      scale.setDomainFrom(from);
      scale.setDomainTo(to);
      return (
        <div className={block}>
          <div className={`${block}__chart-wrapper`}>
            <TimeAxis scale={scale} />
            <Events
              scale={scale}
              recentEvents={this.props.recentEvents}
              changesAreVisible={this.props.changesAreVisible}
              isExpanded={this.props.isExpanded}
            />
          </div>
        </div>
      );
    }

    setupIncidentSubscription() {
      // dispose the old subscription because it's null or uses an old incidentId
      this.disposeIncidentSubscription();

      this.incidentSubscription = getEvent(this.props.incidentId).subscribe(incident => {
        if (incident) {
          this.setState({ from: incident.get('start') });

          if (incident.get('state') === 'open') {
            this.setupServertimeSubscription();
          } else {
            this.disposeServertimeSubscription();
            this.setState({ to: incident.get('end') });
          }
        }
      });
    }

    setupServertimeSubscription() {
      this.disposeServertimeSubscription();

      this.servertimeSubscription = serverTime$.subscribe(to => this.setState({ to }));
    }

    disposeIncidentSubscription() {
      if (this.incidentSubscription) {
        this.incidentSubscription.dispose();
        this.incidentSubscription = null;
      }
    }

    disposeServertimeSubscription() {
      if (this.servertimeSubscription) {
        this.servertimeSubscription.dispose();
        this.servertimeSubscription = null;
      }
    }
  }
);
