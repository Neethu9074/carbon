/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import { getIconType } from 'in-infrastructure/infrastructureIconType';
import EntityWithType from 'in-components/EntityWithType';

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
