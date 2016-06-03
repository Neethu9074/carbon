import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

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
      </div>
    );
  }
});
