import React from 'react/addons';

import './StatusLine.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

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
          {left.substring(0, 12)}
        </h3>
        <p className='in-tooltip__status-line--right'>
          {right}
        </p>
      </div>
    );
  }
});
