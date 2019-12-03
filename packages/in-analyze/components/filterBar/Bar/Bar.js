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
  removeBackgroundColor
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.backgroundColor]: !removeBackgroundColor
      })}
    >
      <MaxWidthFullscreenContainer
        className={evaluateClassNames({
          [locals.bar]: true,
          [locals.removePadding]: removePadding
        })}
      >
        <span className={locals.filter}>
          <SvgIcon className={locals.icon} type="lib_actions_filter" />
          Filters
        </span>
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
