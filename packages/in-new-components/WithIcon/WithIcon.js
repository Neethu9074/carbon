import React from 'react';

import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';

import locals from './WithIcon.mless';

export default function WithIcon({ plugin, snapshot, icon, iconColor, children }) {
  return (
    <div className={locals.wrapper}>
      {plugin || snapshot ? (
        <PluginIcon
          style={{ fill: iconColor }}
          className={locals.pluginIcon}
          size="xs"
          plugin={plugin}
          snapshot={snapshot}
        />
      ) : (
        <SvgIcon style={{ fill: iconColor }} className={locals.linkEntityIcon} type={icon} />
      )}
      <div className={locals.childWrapper}>{children}</div>
    </div>
  );
}
