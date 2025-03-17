/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';

import { t } from 'in-i18n';

export const types = {
  httpRequest: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.HTTPShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.HTTPBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.HTTPLong'),
    color: themes.g10.ids.color.option.purple[500],
    colorType: 'purple'
  },
  sessionStart: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.sesShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.sesBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.sesLong'),
    color: themes.g10.ids.color.option.orange[500],
    colorType: 'orange'
  },
  viewChange: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.traShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.traBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.traLong'),
    color: themes.g10.ids.color.option.lime[500],
    colorType: 'lime'
  },
  custom: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.cusShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.cusBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.cusLong'),
    color: themes.g10.ids.color.option.teal[500],
    colorType: 'teal'
  },
  crash: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.craShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.craBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.craLong'),
    color: themes.g10.ids.color.option.red[500],
    colorType: 'red'
  },
  perf: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.perfShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.perfBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.perfLong'),
    color: themes.g10.ids.color.option.indigo[500],
    colorType: 'blue'
  },
  dropBeacon: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.droppedBeaconShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.droppedBeaconBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.droppedBeaconLong'),
    color: themes.g10.ids.color.option.neutral[500],
    colorType: 'cool-gray'
  },
  default: {
    short: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.defaultShort'),
    badgeLabel: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.defaultBadgeLabel'),
    long: t('in-mobile-apps:sessionView.tabsSumFilterableTypes.defaultLong'),
    color: themes.g10.ids.color.option.neutral[500],
    colorType: 'neutral'
  }
};

export function getType(beacon) {
  return beacon.type;
}
