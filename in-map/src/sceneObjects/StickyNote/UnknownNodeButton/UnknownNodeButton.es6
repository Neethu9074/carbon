import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import iconPath from './plusIcon.svg';

import './UnknownNodeButton.less';

const defaultIconSize = 50;

const UnknownNodeButton = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    onPlusClicked: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {size: defaultIconSize};
  },

  render() {
    const size = Math.max(this.state.size * 0.4, defaultIconSize);
    const style = {width: size + 'px', height: size + 'px'};

    return (
      <img src={iconPath}
           className='in-sticky-note__unknown-node--icon'
           style={style}
           onClick={this.props.onPlusClicked}
      />
    );
  }
});

export default UnknownNodeButton;
