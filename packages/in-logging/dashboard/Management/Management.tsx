/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { CalendarEvent, Integration, TimePlot, AnalyzesData } from '@carbon/pictograms-react';
import React from 'react';

import { CarbonClickableTile, IconButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  dashboardIntegrationsPath,
  dashboardLogVolumePath,
  dashboardPatternRecognitionPath,
  dashboardRetentionManagementPath
} from 'in-logging/navigation/paths';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { patternRecognitionEnabled } from 'in-services/featureFlags';
import { isAddonUserCached } from 'in-logging/api/licence';
import RestrictedAccessMessage from 'in-components/rbac';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Management.mless';

const localisationStrings = {
  management: t('in-logging:dashboard.management'),
  logVolume: t('in-logging:dashboard.managementPage.logVolume'),
  logVolumeDescription: t('in-logging:dashboard.managementPage.logVolumeDescription'),
  logIntegrations: t('in-logging:dashboard.managementPage.logIntegrations'),
  logIntegrationsDescription: t('in-logging:dashboard.managementPage.logIntegrationsDescription'),
  retentionPeriod: t('in-logging:dashboard.managementPage.retentionPeriod'),
  retentionPeriodDescription: t('in-logging:dashboard.managementPage.retentionPeriodDescription'),
  patternRecognition: t('in-logging:dashboard.managementPage.patternRecognition'),
  patternRecognitionDescription: t('in-logging:dashboard.managementPage.patternRecognitionDescription')
};

export default function Management() {
  const { createHrefToPath } = useNavigation();
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  const shouldShowRetentionPeriod = isLoggingAddonUser && user?.role?.canConfigureLogRetentionPeriod;
  const shouldShowLogVolume = isLoggingAddonUser && user?.role?.canViewLogVolume;
  const shouldShowIntegrations = user?.role?.canConfigureLogManagement;
  const shouldShowPatterRecognition = patternRecognitionEnabled;
  if (!shouldShowRetentionPeriod && !shouldShowLogVolume && !shouldShowIntegrations) return <RestrictedAccessMessage />;

  return (
    <LoggingDashboardWrapper>
      <h2 className="cds--assistive-text">{localisationStrings.management}</h2>
      <div className={locals.layout}>
        {shouldShowRetentionPeriod && (
          <CarbonClickableTile href={createHrefToPath(dashboardRetentionManagementPath)}>
            <div className={locals.card}>
              <div className={locals.pictogramWrapper}>
                <TimePlot width={56} />
              </div>
              <div className={locals.description}>
                <h3>{localisationStrings.retentionPeriod}</h3>
                <p>{localisationStrings.retentionPeriodDescription}</p>
              </div>
              <div className={locals.navButton}>
                <IconButton color="#0F62FE" aria-label={'logRetention-link-button'} type="lib_arrow_right" />
              </div>
            </div>
          </CarbonClickableTile>
        )}
        {shouldShowLogVolume && (
          <CarbonClickableTile href={createHrefToPath(dashboardLogVolumePath)}>
            <section className={locals.card}>
              <div className={locals.pictogramWrapper}>
                <CalendarEvent width={56} />
              </div>
              <div className={locals.description}>
                <h3>{localisationStrings.logVolume}</h3>
                <p>{localisationStrings.logVolumeDescription}</p>
              </div>
              <div className={locals.navButton}>
                <IconButton color="#0F62FE" aria-label={'logVolume-link-button'} type="lib_arrow_right" />
              </div>
            </section>
          </CarbonClickableTile>
        )}
        {shouldShowIntegrations && (
          <CarbonClickableTile href={createHrefToPath(dashboardIntegrationsPath)}>
            <section className={locals.card}>
              <div className={locals.pictogramWrapper}>
                <Integration width={56} />
              </div>
              <div className={locals.description}>
                <h3>{localisationStrings.logIntegrations}</h3>
                <p>{localisationStrings.logIntegrationsDescription}</p>
              </div>
              <div className={locals.navButton}>
                <IconButton color="#0F62FE" aria-label={'integration-link-button'} type="lib_arrow_right" />
              </div>
            </section>
          </CarbonClickableTile>
        )}
        {shouldShowPatterRecognition && (
          <CarbonClickableTile href={createHrefToPath(dashboardPatternRecognitionPath)}>
            <section className={locals.card}>
              <div className={locals.pictogramWrapper}>
                <AnalyzesData width={56} />
              </div>
              <div className={locals.description}>
                <h3>{localisationStrings.patternRecognition}</h3>
                <p>{localisationStrings.patternRecognitionDescription}</p>
              </div>
              <div className={locals.navButton}>
                <IconButton color="#0F62FE" aria-label={'patternRecognition-link-button'} type="lib_arrow_right" />
              </div>
            </section>
          </CarbonClickableTile>
        )}
      </div>
    </LoggingDashboardWrapper>
  );
}
