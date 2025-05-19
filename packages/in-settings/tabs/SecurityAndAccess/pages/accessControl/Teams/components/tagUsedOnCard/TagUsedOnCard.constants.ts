/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from '@instana/i18n-react';

import { TeamTagUsedEntity } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/TagUsedOnCard.types';

export const TEAMTAG_USED_ENTITIES: Array<TeamTagUsedEntity> = [
  {
    id: 'ALERT_CHANNEL',
    title: t('in-settings:tabs.teams.teamTagUsedOnAlertChannels')
  },
  {
    id: 'CUSTOM_DASHBOARD',
    title: t('in-settings:tabs.teams.teamTagUsedOnCustomDashboards')
  }
];
