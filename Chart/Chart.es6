'use strict';

import React from 'react/addons';

const rpt = React.PropTypes;
const block = 'in-chart';

const Chart = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    config: rpt.object.isRequired
  },

  render() {
    return (
      <div className={block}>

      </div>
    );
  }
});

export default Chart;
