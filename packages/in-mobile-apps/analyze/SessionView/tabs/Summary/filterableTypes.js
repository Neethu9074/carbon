/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const types = {
  httpRequest: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.HTTPShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.HTTPBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.HTTPLong'),
    color: '#8900b3'
  },
  sessionStart: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.sesShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.sesBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.sesLong'),
    color: '#F16528'
  },
  viewChange: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.traShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.traBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.traLong'),
    color: '#91c200'
  },
  custom: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.cusShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.cusBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.cusLong'),
    color: '#009e89'
  }
};

export function getType(beacon) {
  return beacon.type;
}
