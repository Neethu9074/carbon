import React from 'react';

import PluginIcon from 'in-components/PluginIcon';

import './Metric.less';

const block = 'in-cockpit-metric';

export default function Metric({ label, children, pluginId }) {
  return (
    <div className={block}>
      <div className={`${block}__key`}>
        <Icon plugin={pluginId} />
        {label}
      </div>
      <div className={`${block}__value`}>
        {children}
      </div>
    </div>
  );
}

function Icon({ plugin }) {
  if (plugin) {
    return <PluginIcon plugin={plugin} color="#F3F8F9" dimension={12} className={`${block}__icon`} />;
  }
  return null;
}
