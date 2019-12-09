import PropTypes from 'prop-types';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import evaluateClassNames from 'in-services/util/classnames';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Bar.mless';

export default function Bar({
  children,
  showClearFilters = true,
  onClearFilters,
  removePadding,
  removeBackgroundColor,
  removeShadow,
  removeFiltersIcon
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.backgroundColor]: !removeBackgroundColor,
        [locals.shadow]: !removeShadow
      })}
    >
      <MaxWidthFullscreenContainer
        className={evaluateClassNames({
          [locals.bar]: true,
          [locals.removePadding]: removePadding
        })}
      >
        {!removeFiltersIcon && (
          <span className={locals.filter}>
            <SvgIcon className={locals.icon} type="lib_actions_filter" />
            Filters
          </span>
        )}
        <div>{children}</div>

        {showClearFilters && (
          <Button icon="lib_actions_cached" kind="subtle" size="compact" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </MaxWidthFullscreenContainer>
    </div>
  );
}

Bar.propTypes = {
  children: PropTypes.node.isRequired,
  onClearFilters: PropTypes.func,
  removeBackgroundColor: PropTypes.bool,
  removePadding: PropTypes.bool,
  removeShadow: PropTypes.bool,
  removeFiltersIcon: PropTypes.bool,
  showClearFilters: PropTypes.bool
};
