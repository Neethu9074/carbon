'use strict';

import React from 'react/addons';

import './MetricList.less';

const block = 'in-sidebar-metric-list';

const MetricList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {

  },

  render() {

    return (
      <div className={block}>
      </div>
    );
  }
});

export default MetricList;
