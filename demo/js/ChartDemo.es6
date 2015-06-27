'use strict';

import React from 'react/addons';

import Chart from '../../Chart';

const ChartDemo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    // TODO Define props
    // foo: rpt.string.isRequired
  },

  render() {
    return (
      <Chart config={{
        type: 'stackedArea',
        width: 700,
        height: 300,
        seriesConfig: [
          {label: 'cpu.total.user'},
          {label: 'cpu.total.sys'},
          {label: 'cpu.total.nice'},
          {label: 'cpu.total.wait'},
          {label: 'cpu.total.steal'}
        ]
      }} />
    );
  }
});

export default ChartDemo;
