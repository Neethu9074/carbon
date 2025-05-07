/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon, Button, Typography } from '@instana/components';

import { t } from 'in-i18n';

import locals from './Bar.mless';

export default function Bar({ children, showClearFilters = true, onClearFilters, withoutLabel, isGrouping }) {
  const iconName = isGrouping ? 'lib_group_by' : 'lib_actions_filter';
  const label = isGrouping ? t('in-analyze:components.filterBar.group') : t('in-analyze:components.filterBar.filters');

  return (
    <section aria-label={t('in-components:pageStructure.filterAriaLabel')} className={locals.bar}>
      <div className={locals.left}>
        {!withoutLabel && (
          <span className={locals.filter}>
            <SvgIcon className={locals.icon} type={iconName} />
            <Typography component={'h2'} noMargin>
              {label}
            </Typography>
          </span>
        )}
        <div className={locals.options}>{children}</div>
      </div>

      {showClearFilters && (
        <Button icon="lib_openclose_cancel" kind="subtle" size="compact" onClick={onClearFilters}>
          {t('in-analyze:components.filterBar.clearFilters')}
        </Button>
      )}
    </section>
  );
}

Bar.propTypes = {
  children: PropTypes.node.isRequired,
  onClearFilters: PropTypes.func,
  showClearFilters: PropTypes.bool,
  withoutLabel: PropTypes.bool,
  isGrouping: PropTypes.bool
};
