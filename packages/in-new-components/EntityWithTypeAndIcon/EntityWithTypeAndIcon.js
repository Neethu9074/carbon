import PropTypes from 'prop-types';
import React from 'react';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import EntityWithType from 'in-new-components/EntityWithType';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityWithTypeAndIcon.mless';

export default function EntityWithTypeAndIcon({ label, type, iconType, plugin, size, showTechnologyLabel = true }) {
  if (plugin) {
    iconType = getIconType(plugin);
  }

  return (
    <div className={locals.wrapper}>
      <SvgIcon className={locals.entityIcon} type={iconType} size={size} />
      {showTechnologyLabel && <EntityWithType label={label} type={type} />}
    </div>
  );
}

EntityWithTypeAndIcon.propTypes = {
  showTechnologyLabel: PropTypes.bool,
  iconType: PropTypes.string,
  plugin: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string
};
