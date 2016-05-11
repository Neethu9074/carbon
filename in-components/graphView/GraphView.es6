import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Graph from 'in-components/graphView/components/Graph';

import './GraphView.less';

const block = 'in-graph-view';

export default React.createClass({

  displayName: 'GraphView',

  mixins: [PureRenderMixin],

  propTypes: {
  },

  render() {
    return (
      <div className={block}>
        <Graph />
      </div>
    );
  }
});
