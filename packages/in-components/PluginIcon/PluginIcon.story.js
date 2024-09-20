/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import 'in-components/PluginIcon/PluginIcon.story.css';
import PluginIcon from 'in-components/PluginIcon';
import { plugins } from 'in-forge/constants';

export default {
  component: PluginIcon
};

const pluginArgType = {
  plugin: {
    control: 'select',
    options: Object.keys(plugins),
    mapping: plugins
  }
};

export const Default = props => <PluginIcon {...props} />;
Default.args = {
  plugin: Object.keys(plugins)[0]
};
Default.argTypes = {
  ...pluginArgType
};

export const List = () => (
  <div className="list">
    {Object.keys(plugins).map(plugin => (
      <div className="item">
        <PluginIcon plugin={plugin} />
        <span>{plugin}</span>
      </div>
    ))}
  </div>
);
