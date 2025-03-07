/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback } from 'react';
import classNames from 'classnames';

import {
  CarbonStack as Stack,
  SvgIcon,
  SvgIconSizes,
  CarbonMenuButton,
  CarbonMenuItem,
  AutoReposition
} from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/RevisionDropdown.mless';

export default function RevisionDropdown({ alertConfigVersions, setRevision, alertRevision }) {
  const onClick = item => {
    setRevision(item.created);
  };

  const renderIcon = useCallback(iconType => {
    return iconType ? (
      <SvgIcon className={locals.icon} type={iconType} size={SvgIconSizes.s} aria-hidden="true" />
    ) : null;
  }, []);

  // Special case: using feature flag to turn off floating menu to
  // force popup menu positioning to bottom-end.
  return (
    <AutoReposition>
      <CarbonMenuButton
        kind="primary"
        size="sm"
        menuAlignment="bottom-end"
        className={locals.menuButton}
        label={
          <div className={locals.title}>
            <SvgIcon type={'lib_actions_filter'} size="xs" className={locals.filter} />
            {t('in-alerting:components.revisionDropdownButton.buttonLabel')}
          </div>
        }
      >
        {alertConfigVersions.map(item => (
          <CarbonMenuItem
            key={item.created}
            label={renderItemContent(item)}
            disabled={item.disabled}
            onClick={() => onClick(item)}
            className={classNames({
              [locals.menuitem]: true,
              [locals.selected]: item.created === alertRevision.created
            })}
            renderIcon={() => renderIcon(item.iconType)}
          />
        ))}
      </CarbonMenuButton>
    </AutoReposition>
  );
}

function renderItemContent(item) {
  const { description, created, changeSummary } = item;
  const { fullName: authorName } = changeSummary.author;

  return (
    <Stack gap={1} className={locals.itemContainer} title="">
      <Stack orientation="horizontal" gap={3} className={locals.description}>
        <div className={locals.textPrimary}>{description}</div>
        <time dateTime={formatDateTime(created)} className={classNames(locals.date, locals.textSecondary)}>
          ({formatDateTime(created)})
        </time>
      </Stack>
      {authorName && <div className={classNames(locals.name, locals.textSecondary)}>{authorName}</div>}
    </Stack>
  );
}
