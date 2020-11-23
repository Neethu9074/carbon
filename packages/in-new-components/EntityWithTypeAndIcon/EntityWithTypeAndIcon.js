import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import EntityWithType from 'in-new-components/EntityWithType';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityWithTypeAndIcon.mless';

const EntityWithTypeAndIcon = forwardRef(function EntityWithTypeAndIcon(
  { label, type, iconType, plugin, size, showTechnologyLabel = true },
  ref
) {
  if (plugin) {
    iconType = getIconType(plugin);
  }

  return (
    <div className={locals.wrapper} ref={ref}>
      <SvgIcon className={locals.entityIcon} type={iconType} size={size} />
      {showTechnologyLabel && <EntityWithType label={label} type={type} />}
    </div>
  );
});

EntityWithTypeAndIcon.propTypes = {
  showTechnologyLabel: PropTypes.bool,
  iconType: PropTypes.string,
  plugin: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string
};

export default EntityWithTypeAndIcon;
