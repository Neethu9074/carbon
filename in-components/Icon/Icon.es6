import React from 'react';

import './Icon.less';

const Icon = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    type: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
    onClick: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func
  },

  render() {
    let classes = 'icon icon-' + this.props.type;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    if (this.props.onClick) {
      return (
        <button type='button'
                className={classes}
                style={this.props.style}
                onClick={this.props.onClick}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}/>
      );
    }

      return (
      <i className={classes}
         style={this.props.style}
         onMouseEnter={this.props.onMouseEnter}
         onMouseLeave={this.props.onMouseLeave}/>
    );
  }
});

export default Icon;
