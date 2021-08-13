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

const CHANGE_TYPE = {
  UPDATE: 'UPDATE',
  CREATE: 'CREATE',
  DISABLE: 'DISABLE',
  ENABLE: 'ENABLE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  UNKNOWN: 'UNKNOWN'
};

export default function RevisionDropdown({ alertConfig, alertConfigVersions, setRevision, alertRevision }) {
  // Remove this line after BE PR for new response object structure is merged. See function comment formore info.
  const alertConfigVersionsNewStruture = convertToNewResponseStructure(alertConfigVersions);

  const enhancedAlertConfigVersions = enhanceAlertConfigVersions(alertConfigVersionsNewStruture);

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

function enhanceAlertConfigVersions(alertConfigVersions) {
  let revisionCount = 0;

  const hasMixedVersioning =
    alertConfigVersions.some(({ changeSummary }) => changeSummary.changeType === CHANGE_TYPE.UNKNOWN) &&
    alertConfigVersions.some(({ changeSummary }) => changeSummary.changeType !== CHANGE_TYPE.UNKNOWN);

  return [...alertConfigVersions]
    .reverse()
    .map(cv => {
      const configVersion = { ...cv };
      const { changeType } = configVersion.changeSummary;

      switch (changeType) {
        case CHANGE_TYPE.UNKNOWN:
          revisionCount++;
          configVersion.description = t('in-alerting:components.revisionDropdownButton.revision', {
            alertRevision: revisionCount
          });
          configVersion.iconType = hasMixedVersioning ? 'lib_actions_edit' : undefined;
          return configVersion;

        case CHANGE_TYPE.DISABLE:
          configVersion.description = t('in-alerting:components.revisionDropdownButton.pause');
          configVersion.iconType = 'lib_actions_pause';
          return configVersion;

        case CHANGE_TYPE.ENABLE: {
          configVersion.description = t('in-alerting:components.revisionDropdownButton.resume');
          configVersion.iconType = 'lib_actions_play';
          return configVersion;
        }
        case CHANGE_TYPE.DELETE:
          configVersion.description = t('in-alerting:components.revisionDropdownButton.delete');
          configVersion.iconType = 'lib_actions_delete';
          return configVersion;

        case CHANGE_TYPE.UPDATE:
          revisionCount++;
          configVersion.iconType = 'lib_actions_edit';
          configVersion.description = t('in-alerting:components.revisionDropdownButton.update', {
            alertRevision: revisionCount
          });
          return configVersion;

        case CHANGE_TYPE.RESTORE:
          revisionCount++;
          configVersion.iconType = 'lib_actions_revert';
          configVersion.description = t('in-alerting:components.revisionDropdownButton.restore', {
            alertRevision: revisionCount
          });
          return configVersion;

        case CHANGE_TYPE.CREATE:
          configVersion.description = t('in-alerting:components.revisionDropdownButton.create');
          configVersion.iconType = 'lib_alerts_create';
          return configVersion;
      }
    })
    .reverse();
}

// This function can be deleted after backend task https://instana.kanbanize.com/ctrl_board/37/cards/68721/details/ is merged.
// It converts our current alert versions into the new stucture as defined here:
// https://www.notion.so/instana/Smart-Alert-version-control-b276ed1d16c940bf9a12a98591f74363#3c9ab3ebd60a475f8347f94638d2fbd3
function convertToNewResponseStructure(alertConfigVersions) {
  return alertConfigVersions.map(cv => {
    const configVersion = { ...cv };
    configVersion.changeSummary ??= {
      changeType: CHANGE_TYPE.UNKNOWN,
      author: { fullName: null }
    };
    return configVersion;
  });
}
