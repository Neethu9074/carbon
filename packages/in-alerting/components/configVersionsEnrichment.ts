/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { ConfigVersion } from 'in-types';
import { t } from 'in-i18n';

export interface ExtendedConfigVersion extends ConfigVersion {
  readonly description: string;
  readonly iconType?: string;
  readonly disabled?: boolean;
}

export function extendAlertConfigVersions(alertConfigVersions: ConfigVersion[]): ExtendedConfigVersion[] {
  let revisionCount = 1;

  const hasMixedVersioning =
    alertConfigVersions.some(({ changeSummary }) => changeSummary?.changeType === 'UNKNOWN') &&
    alertConfigVersions.some(({ changeSummary }) => changeSummary?.changeType !== 'UNKNOWN');

  return [...alertConfigVersions]
    .reverse()
    .map(cv => {
      const { changeType } = cv.changeSummary ?? {};

      switch (changeType) {
        case 'UNKNOWN':
          return {
            ...cv,
            description: t('in-alerting:components.revisionDropdownButton.revision', {
              alertRevision: revisionCount++
            }),
            iconType: hasMixedVersioning ? 'lib_actions_edit' : undefined
          };

        case 'DISABLE':
          return {
            ...cv,
            description: t('in-alerting:components.revisionDropdownButton.pause'),
            iconType: 'lib_actions_pause',
            disabled: true
          };

        case 'ENABLE':
          return {
            ...cv,
            description: t('in-alerting:components.revisionDropdownButton.resume'),
            iconType: 'lib_actions_play',
            disabled: true
          };

        case 'DELETE':
          return {
            ...cv,
            description: t('in-alerting:components.revisionDropdownButton.delete'),
            iconType: 'lib_actions_delete'
          };

        case 'UPDATE':
          return {
            ...cv,
            iconType: 'lib_actions_edit',
            description: t('in-alerting:components.revisionDropdownButton.revision', {
              alertRevision: revisionCount++
            })
          };

        case 'RESTORE':
          return {
            ...cv,
            iconType: 'lib_actions_revert',
            description: t('in-alerting:components.revisionDropdownButton.restore', {
              alertRevision: revisionCount++
            })
          };

        case 'CREATE':
          return {
            ...cv,
            description: t('in-alerting:components.revisionDropdownButton.create'),
            iconType: 'lib_alerts_create'
          };

        default:
          return { ...cv, description: '' };
      }
    })
    .reverse();
}
