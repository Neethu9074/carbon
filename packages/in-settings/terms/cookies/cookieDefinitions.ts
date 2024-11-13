/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const cookieDefinitions = [
  {
    key: 'allAnalyticsServices',
    title: t('in-settings:cookies.mixpanel.title'),
    cookieProduct: 'Mixpanel',
    details: [
      {
        category: t('in-settings:cookies.categories.analyticalPerformance'),
        name: 'mp_[ID]_mixpanel',
        purpose: t('in-settings:cookies.mixpanel.purpose'),
        moreInformation: t('in-settings:cookies.expiration.sevenDays')
      }
    ]
  },
  {
    key: 'walkmeAnalyticsServices',
    title: t('in-settings:cookies.walkme.title'),
    cookieProduct: 'WalkMe',
    details: [
      {
        category: t('in-settings:cookies.walkme.category'),
        name: 'ajs_anonymous_id',
        purpose: t('in-settings:cookies.walkme.purpose'),
        moreInformation: t('in-settings:cookies.expiration.afterSession')
      }
    ]
  },
  {
    key: 'allSupportAndResearchServices',
    title: t('in-settings:cookies.appcues.title'),
    cookieProduct: 'Appcues',
    details: [
      {
        category: t('in-settings:cookies.categories.functionality'),
        name: 'apc_local_id',
        purpose: t('in-settings:cookies.appcues.purpose'),
        moreInformation: t('in-settings:cookies.expiration.persistent')
      },
      {
        category: t('in-settings:cookies.categories.functionality'),
        name: 'apc_user_id',
        purpose: t('in-settings:cookies.appcues.purpose'),
        moreInformation: t('in-settings:cookies.expiration.persistent')
      },
      {
        category: t('in-settings:cookies.categories.functionality'),
        name: 'apc_my_id',
        purpose: t('in-settings:cookies.appcues.purpose'),
        moreInformation: t('in-settings:cookies.expiration.afterSession')
      },
      {
        category: t('in-settings:cookies.categories.functionality'),
        name: 'apc_my_id_ts',
        purpose: t('in-settings:cookies.appcues.purpose'),
        moreInformation: t('in-settings:cookies.expiration.afterSession')
      },
      {
        category: t('in-settings:cookies.categories.functionality'),
        name: 'apc_user',
        purpose: t('in-settings:cookies.appcues.purpose'),
        moreInformation: t('in-settings:cookies.expiration.afterSession')
      }
    ]
  }
];
