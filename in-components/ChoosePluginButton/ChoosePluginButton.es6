import React from 'react/addons';

import * as constants from 'in-forge/constants';
import {getClassName} from 'in-services/react';

import './ChoosePluginButton.less';

const rpt = React.PropTypes;
const block = 'in-choose-plugin-button';

const plugins = [
  {label: 'Process/Docker', ids: [
    constants.plugins.process,
    constants.plugins.docker
  ]},
  {label: 'OS', ids: [
    constants.plugins.os
  ]}
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
    const ids = plugins[this.state.pluginIndex].ids;
    this.props.onClick(ids);

    let index = this.state.pluginIndex + 1;
    if(index >= plugins.length) {
      index = 0;
    }
    this.setState({pluginIndex: index});
  },

  render() {
    const plugin = plugins[this.state.pluginIndex];
    return (
      <button className={getClassName(this, block)} onClick={this.clicked}>
        {'switch to ' + plugin.label + ' view'}
      </button>
    );
  }
});

export default ChoosePluginButton;
