/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  hasAnalyzeAccess,
  hasApplicationsAccess,
  hasInfrastructureAnalyzeAccess,
  hasMobileAppsAccess,
  hasWebsitesAccess
} from 'in-stores/permission';
import {
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore,
  isInfraExploreView
} from 'in-infrastructure/navigation/paths';
import {
  isAnalyzeView as isMobileAppAnalyzeView,
  useLinkToAnalyze as useLinkToMobileAppAnalyze
} from 'in-mobile-apps/navigation/paths';
import {
  isAnalyzeView as isWebsiteAnalyzeView,
  useLinkToAnalyze as useLinkToWebsiteAnalyze
} from 'in-websites/navigation/paths';
import { isAnalyzeView as isLogsAnalyzeView, logsPathWithDataSource } from 'in-logging/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { isAnalyzeView as isProfileAnalyzeView } from 'in-components/Profiling/navigation/paths';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isAnalyzeView } from 'in-analyze/navigation/constants';
import { any } from 'in-services/fixedStreams';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function AnalyticsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isActiveLegacy = useObservable(
    any(isWebsiteAnalyzeView, isMobileAppAnalyzeView, isProfileAnalyzeView, isLogsAnalyzeView, isInfraExploreView()),
    []
  );

  const analyzeWebsiteHref = useLinkToWebsiteAnalyze({ beaconType: 'pageLoad', groupBy: {} });
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const getLinkToMobileAppAnalyze = useLinkToMobileAppAnalyze();
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  if (!hasAnalyzeAccess && !role?.canViewLogs) return null;

  const isActive = matchLocation(isAnalyzeView) || isActiveLegacy;

  let analyzePath = '';

  if (hasApplicationsAccess) {
    analyzePath = urlWithoutQueryParameter(getLinkToApplicationAnalyze({ dataSource: 'calls' }));
  } else if (hasWebsitesAccess) {
    analyzePath = analyzeWebsiteHref!; // since we pass groupBy and beaconType this value is never null
  } else if (role?.canViewLogs) {
    analyzePath = createHrefToPath(logsPathWithDataSource);
  } else if (hasMobileAppsAccess) {
    analyzePath = getLinkToMobileAppAnalyze({ beaconType: 'sessionStart', groupBy: {} });
  } else if (hasInfrastructureAnalyzeAccess) {
    analyzePath = getLinkToInfraEntityExplore(defaultInfraExploreViewParams);
  }

  return (
    <MenuItem
      id="main-nav-analyze"
      label={t('in-components:mainNavigation.viewSwitcherLabelAnalytics')}
      icon="lib_analyze_inverted"
      isActive={isActive || false}
      href={analyzePath}
    />
  );
}
