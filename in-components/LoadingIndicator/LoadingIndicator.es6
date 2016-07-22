import React from 'react';

import './LoadingIndicator.less';

const block = 'in-loading-indicator';
const rectClass = block + '__rect';

const LoadingIndicator = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    inline: React.PropTypes.bool,
    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      type: 'light',
      inline: true
    };
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    const rects = [];
    const colorClass = this.props.type !== 'light' ? ' ' + rectClass + '--' + this.props.type : '';

    for (let i = 1; i < 6; i++) {
      rects.push(
        <div key={i}
             className={rectClass + '--' + i + ' ' + rectClass + colorClass}/>
      );
    }

    let classes = block;
    if (!this.props.inline) {
      classes = `${classes} ${block}--block`;
    }

    return (
      <div className={block}
           style={this.props.style}>
        {rects}
      </div>
    );
  }
});

export default LoadingIndicator;
