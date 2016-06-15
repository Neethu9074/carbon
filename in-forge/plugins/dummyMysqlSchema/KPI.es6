import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  msZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';

import KPIList from 'in-components/KPIList';


export default React.createClass({
  displayName: 'dummyKPI',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <KPIList snapshot={this.props.snapshot}
               metrics={[
                 'METRIC_NAME_HERE',
                 'METRIC_NAME_HERE',
                 'errors',
                 'sessions'
               ]}
               labels={[
                 'calls/s',
                 'latency',
                 'errors',
                 'sessions'
               ]}
               formatters={[
                 zeroDecimalPlaces,
                 msZeroDecimalPlaces,
                 percentageTwoDecimalPlaces,
                 zeroDecimalPlaces
               ]}/>
    );
  }
});
