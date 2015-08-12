import React from 'react/addons';

import * as constants from 'in-forge/constants';

import './ChoosePluginButton.less';

const rpt = React.PropTypes;
const block = 'in-choose-plugin-button';

const plugins = [
  {label: 'Process', id: constants.plugins.process},
  {label: 'OS', id: constants.plugins.os}
];

const ChoosePluginButton = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    className: rpt.string,
    onClick: rpt.func.isRequired
  },

  getInitialState() {
    return {pluginIndex: 0};
  },

  componentDidMount() {
  },

  clicked() {
    const id = plugins[this.state.pluginIndex].id;
    this.props.onClick(id);

    let index = this.state.pluginIndex + 1;
    if(index >= plugins.length) {
      index = 0;
    }
    this.setState({pluginIndex: index});
  },

  render() {
    const plugin = plugins[this.state.pluginIndex];
    const className = this.props.className ?
      this.props.className + ' ' + block :
      block;

    return (
      <button className={className} onClick={this.clicked}>
        {'switch to ' + plugin.label + ' view'}
      </button>
    );
  }
});

export default ChoosePluginButton;
