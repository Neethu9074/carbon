import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './Frame.less';

const block = 'in-tooltip__frame';
const rpt = React.PropTypes;

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: rpt.any.isRequired,
    anchor: rpt.string
  },

  render() {
    const children = this.props.children;

    // return null if there are no children available
    if (!children || children.length === 0) {
      return null;
    }

    const anchor = this.props.anchor ? this.props.anchor : 'left';

    return (
      <div className={block + ' ' + block + '__' + anchor}>
        {this.props.children}
      </div>
    );
  }
});
