

import React from 'react/addons';

import './StatusLine.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    left: React.PropTypes.string.isRequired,
    right: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className='in-tooltip__status-line'>
        <h3 className='in-tooltip__status-line--left'>
          {this.props.left}
        </h3>
        <p className='in-tooltip__status-line--right'>
          {this.props.right}
        </p>
      </div>
    );
  }
});
