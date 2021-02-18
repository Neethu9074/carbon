/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import { t } from 'in-i18n';
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
        {message ??
          t('in-new-components:resultForTimeSelectionIndicator.labelShowingForSelection', { entityName: entityName })}
      </div>
      <Button size="compact" kind="action" icon="lib_openclose_circle" onClick={clearHighlightedTimeframe}>
        {t('in-new-components:resultForTimeSelectionIndicator.buttonClearSelection')}
      </Button>
    </div>
  );
}
