import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import CountersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/CountersTable';
import GaugesTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/GaugesTable';
import MetersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/MetersTable';
import {timeframeShape} from 'in-stores/timeline';


const DropwizardDashboard = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: timeframeShape
    },

    getInitialState() {
      return {
        selectedMetricGauge: null,
        selectedMetricCounter: null,
        selectedMetricMeter: null
      };
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;

      return (
        <div>
          <GaugesTable snapshot={snapshot} timeframe={timeframe} />
          <CountersTable snapshot={snapshot} timeframe={timeframe} />
          <MetersTable snapshot={snapshot} timeframe={timeframe} />
        </div>
      );
    }
});

export default DropwizardDashboard;
