import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './TraceView.less';

const block = 'in-trace-view';

export default React.createClass({
  displayName: 'TraceView',

  mixins: [PureRenderMixin],

  propTypes: {
    // TODO Define props
    // foo: rpt.string.isRequired
  },

  render() {
    return (
      <div className={block}>
        Trace View
      </div>
    );
  }
});
