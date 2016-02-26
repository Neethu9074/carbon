import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './StatusLine.less';

export default React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    left: React.PropTypes.string,
    right: React.PropTypes.string
  },

  render() {
    const left = this.props.left || '';
    const right = this.props.right || '';

    return (
      <div className='in-tooltip__status-line'>
        <h3 className='in-tooltip__status-line--left'>
          {left}
        </h3>
        <p className='in-tooltip__status-line--right'>
          {right}
        </p>
      </div>
    );
  }
});
