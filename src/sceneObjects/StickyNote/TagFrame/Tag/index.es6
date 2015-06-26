'use strict';

import React from 'react/addons';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    return (
      <div className="in-sticky-note__tag">
        {this.props.tag}
      </div>
    );
  }
});
