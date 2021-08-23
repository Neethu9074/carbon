/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, SvgIcon, SvgIconSizes } from '@instana/components';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/RevisionDropdown.mless';

export default function RevisionDropdown({ alertConfigVersions, setRevision, alertRevision }) {
  const options = alertConfigVersions.map(v => ({
    value: v,
    label: renderItemContent(v)
  }));

  const selectedOption = options.find(({ value }) => value.created === alertRevision.created);

  return (
    <ComboBoxBehavior
      value={selectedOption?.value}
      options={options}
      onChange={revision => {
        setRevision(revision.created);
      }}
      listItemAlignment="left"
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="primaryv2" icon="lib_actions_filter" expanded={isOpen}>
          {t('in-alerting:components.revisionDropdownButton.buttonLabel')}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderItemContent(item) {
  const { description, created, iconType, changeSummary } = item;
  const { fullName: authorName } = changeSummary.author;

  return (
    <div className={locals.itemContainer}>
      <Stack direction="horizontal" gap="normal" align="center">
        {iconType && <SvgIcon className={locals.icon} type={item.iconType} size={SvgIconSizes.s} aria-hidden="true" />}
        <Stack direction="vertical" gap="xxsmall">
          <Stack direction="horizontal" gap="xlarge">
            <div className={classNames(locals.description, locals.textPrimary)}>{description}</div>
            <time dateTime={formatDateTime(created)} className={classNames(locals.date, locals.textSecondary)}>
              ({formatDateTime(created)})
            </time>
          </Stack>
          {authorName && <div className={classNames(locals.name, locals.textSecondary)}>{authorName}</div>}
        </Stack>
      </Stack>
    </div>
  );
}
