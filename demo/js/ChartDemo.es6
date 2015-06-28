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
      <div style={{background: 'white', display: 'inline-block'}}>
        <Chart config={{
          type: 'stackedArea',
          width: 700,
          height: 300,
          margins: {
            top: 0,
            right: 40,
            bottom: 40,
            left: 40
          },
          seriesConfig: [
            {label: 'cpu.total.user'},
            {label: 'cpu.total.sys'},
            {label: 'cpu.total.nice'},
            {label: 'cpu.total.wait'},
            {label: 'cpu.total.steal'}
          ],
          windowSize: 30
        }} />
      </div>
    );
  }
});

export default ChartDemo;
