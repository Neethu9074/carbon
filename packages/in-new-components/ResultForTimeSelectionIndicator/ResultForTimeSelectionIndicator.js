import classNames from 'classnames';
import React from 'react';

import { clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ResultForTimeSelectionIndicator.mless';

export default function ResultForTimeSelectionIndicator({ className, entityName, message }) {
  return (
    <div className={classNames(locals.wrapper, className)}>
      <div className={locals.notificationWrapper}>
        <SvgIcon className={locals.icon} type="lib_help_error_info_outline" />
        {message ?? `Showing ${entityName} for selection`}
      </div>
      <Button size="compact" kind="action" icon="lib_openclose_circle" onClick={clearHighlightedTimeframe}>
        Clear selection
      </Button>
    </div>
  );
}
