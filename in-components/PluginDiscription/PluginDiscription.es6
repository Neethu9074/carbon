import React from 'react';

import {getIcon} from 'in-sdk/snapshot';

import './PluginDiscription.less';

const block = 'in-plugin-discription';

export default React.createClass({

  displayName: 'PluginDiscription',

  propTypes: {
    plugin: React.PropTypes.string
  },

  render() {
    const plugin = this.props.plugin;
    if (!plugin) {
      return null;
    }

    return (
      <div className={block}>
        <img src={getIcon(plugin)}
             alt='Snapshot icon'
             className={block + '__icon'}/>
        <span className={block + '__label'}>
          {plugin}
        </span>
      </div>
    );
  }
});
