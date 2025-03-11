/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const cookieDefinitions = [
  {
    key: 'walkmeAnalyticsServices',
    title: t('in-settings:cookies.walkme.title'),
    description: t('in-settings:cookies.walkme.description'),
    details: [
      {
        category: t('in-settings:cookies.walkme.category'),
        name: 'walkMe_wm-ueug',
        purpose: t('in-settings:cookies.walkme.purpose'),
        moreInformation: t('in-settings:cookies.expiration.afterSession')
      }
    ]
  }
];

export const toolDefinitions = [
  {
    key: 'assistmeGuidanceServices',
    title: t('in-settings:cookies.assistme.title'),
    description: t('in-settings:cookies.assistme.description')
  }
];
