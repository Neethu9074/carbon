import React from 'react';

import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';

import locals from './WithIcon.mless';

export default function WithIcon({ plugin, icon, iconColor, children }) {
  return (
    <div className={locals.wrapper}>
      {plugin ? (
        <PluginIcon style={{ fill: iconColor }} className={locals.pluginIcon} dimension={18} plugin={plugin} />
      ) : (
        <SvgIcon style={{ fill: iconColor }} className={locals.linkEntityIcon} type={icon} width={24} height={24} />
      )}
      {children}
    </div>
  );
}
