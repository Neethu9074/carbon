/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './Bar.mless';

export default function Bar({ children, showClearFilters = true, onClearFilters, withoutLabel, isGrouping }) {
  const iconName = isGrouping ? 'lib_group_by' : 'lib_actions_filter';
  const label = isGrouping ? t('in-analyze:components.filterBar.group') : t('in-analyze:components.filterBar.filters');

  return (
    <div className={locals.bar}>
      <div className={locals.left}>
        {!withoutLabel && (
          <span className={locals.filter}>
            <SvgIcon className={locals.icon} type={iconName} />
            {label}
          </span>
        )}
        <div className={locals.options}>{children}</div>
      </div>

      {showClearFilters && (
        <Button icon="lib_openclose_cancel" kind="subtle" size="compact" onClick={onClearFilters}>
          {t('in-analyze:components.filterBar.clearFilters')}
        </Button>
      )}
    </div>
  );
}

Bar.propTypes = {
  children: PropTypes.node.isRequired,
  onClearFilters: PropTypes.func,
  showClearFilters: PropTypes.bool,
  withoutLabel: PropTypes.bool,
  isGrouping: PropTypes.bool
};
