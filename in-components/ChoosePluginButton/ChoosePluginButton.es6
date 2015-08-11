import React from 'react/addons';

import './ChoosePluginButton.less';

const rpt = React.PropTypes;
const block = 'in-choose-plugin-button';

const ChoosePluginButton = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    className: rpt.string,
    onClick: rpt.func.isRequired
  },

  componentDidMount() {
  },

  render() {
    const className = this.props.className ?
      this.props.className + ' ' + block :
      block;

    return (
      <button className={className} onClick={this.props.onClick}>
        {'hallo'}
      </button>
    );
  }
});

export default ChoosePluginButton;
