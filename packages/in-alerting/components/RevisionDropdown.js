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

export default function RevisionDropdown({ alertConfig, alertConfigVersions, setRevision, alertRevision }) {
  const enhancedAlertConfigVersions = enhanceAlertConfigVersions(alertConfigVersions);

  const options = enhancedAlertConfigVersions.map((v, i) => ({
    value: v,
    label: renderItemContent(v, i, alertConfig, enhancedAlertConfigVersions)
  }));

  const selectedOption = options[enhancedAlertConfigVersions.length - alertRevision];

  return (
    <ComboBoxBehavior
      align="bottomRight"
      value={selectedOption?.value}
      options={options}
      onChange={revision => {
        setRevision(revision.created);
      }}
      listItemAlignment="left"
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="primaryv2" icon="lib_datetime_timerange" expanded={isOpen}>
          {selectedOption?.value?.description}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

export function toAlertRevision(i, alertConfigVersions) {
  return alertConfigVersions.length - i;
}

function renderItemContent(item) {
  const { description, created, iconType, userName, apiTokenName } = item;
  const name = userName ?? apiTokenName;

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
          {name && <div className={classNames(locals.name, locals.textSecondary)}>{name}</div>}
        </Stack>
      </Stack>
    </div>
  );
}

function enhanceAlertConfigVersions(alertConfigVersions) {
  let revisionCount = 0;

  const hasMixedVersioning =
    alertConfigVersions.some(({ changeType }) => Boolean(changeType)) &&
    alertConfigVersions.some(({ changeType }) => !changeType);

  return [...alertConfigVersions]
    .reverse()
    .map(cv => {
      const configVersion = { ...cv };
      const containsVersioningInformation = 'changeType' in configVersion;

      // Fallback for older configs which have no versioning
      if (!containsVersioningInformation) {
        revisionCount++;
        configVersion.description = t('in-alerting:components.revisionDropdownButton.revision', {
          alertRevision: revisionCount
        });
        configVersion.iconType = hasMixedVersioning ? 'lib_actions_edit' : undefined;
        return configVersion;
      }

      const changeType = configVersion.changeType.toLowerCase();
      if (changeType === 'disabled') {
        configVersion.description = t('in-alerting:components.revisionDropdownButton.paused');
        configVersion.iconType = 'lib_actions_pause';
        return configVersion;
      }
      if (changeType === 'enabled') {
        configVersion.description = t('in-alerting:components.revisionDropdownButton.resumed');
        configVersion.iconType = 'lib_actions_play';
        return configVersion;
      }
      if (changeType === 'delete') {
        configVersion.description = t('in-alerting:components.revisionDropdownButton.deleted');
        configVersion.iconType = 'lib_actions_delete';
        return configVersion;
      }
      if (changeType === 'update') {
        revisionCount++;
        configVersion.iconType = 'lib_actions_edit';
        configVersion.description = t('in-alerting:components.revisionDropdownButton.update', {
          alertRevision: revisionCount
        });
        return configVersion;
      }
      if (changeType === 'restored') {
        revisionCount++;
        configVersion.iconType = 'lib_actions_revert';
        configVersion.description = t('in-alerting:components.revisionDropdownButton.revision', {
          alertRevision: revisionCount
        });
        return configVersion;
      }
      if (changeType === 'created') {
        configVersion.description = t('in-alerting:components.revisionDropdownButton.created');
        configVersion.iconType = 'lib_alerts_create';
        return configVersion;
      }
    })
    .reverse();
}
