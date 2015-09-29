import React from 'react/addons';

import Icon from 'in-components/Icon';

import './ChangeTimeButton.less';

const block = 'in-timeline-change-time-button';

const ChangeTimeButton = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { open: false };
  },

  render() {
    return (
      <Icon type={'metrics'}
            className={block}
            onClick={this.props.onClick} />
    );
  }
});

export default ChangeTimeButton;
