import React from 'react';

import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export default function EntityLink({ label, plugin, icon, href$ }) {
  return (
    <div className={locals.wrapper}>
      {plugin ? (
        <PluginIcon className={locals.pluginIcon} dimension={18} plugin={plugin} />
      ) : (
        <SvgIcon className={locals.linkEntityIcon} type={icon} width={24} height={24} />
      )}
      <Link href$={href$}>{label}</Link>
    </div>
  );
}
