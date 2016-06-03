import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Universe from 'in-components/graphView/components/Universe';

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
        <Universe className={block + '__universe'}/>
      </div>
    );
  }
});
