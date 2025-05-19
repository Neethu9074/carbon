/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyzesData, CalendarEvent, Integration, TimePlot } from '@carbon/pictograms-react';
// eslint-disable-next-line no-restricted-imports
import { AILabel } from '@carbon/react';
import React, { useState } from 'react';

import { CarbonClickableTile, CarbonModal, IconButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  dashboardIntegrationsPath,
  dashboardLogVolumePath,
  dashboardPatternRecognitionPath,
  dashboardRetentionManagementPath
} from 'in-logging/navigation/paths';
import {
  localisationStrings,
  patterRecognitionLocalisationStrings
} from 'in-logging/dashboard/Management/localisationStrings';
import InitialModalScreen from 'in-logging/dashboard/Management/PatternRecognitionModal/InitialScreen';
import { LogPatternsAiLabel } from 'in-logging/dashboard/Management/LogPatternsAiLabel';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { patternRecognitionEnabled } from 'in-services/featureFlags';
import { isAddonUserCached } from 'in-logging/api/licence';
import RestrictedAccessMessage from 'in-components/rbac';
import { user } from 'in-stores/user';

import locals from './Management.mless';

export default function Management() {
  const { createHrefToPath, goToPath } = useNavigation();
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);
  const [openTearsheet, setOpenTearsheet] = useState(false);

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
        {shouldShowPatterRecognition && (
          <CarbonClickableTile
            aria-label={localisationStrings.patternRecognition}
            role="tabpanel"
            onClick={() => setOpenTearsheet(true)}
            decorator={<AILabel />}
          >
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

        {openTearsheet && (
          <CarbonModal
            className={locals.tearsheet}
            open
            modalHeading={localisationStrings.patternRecognition}
            primaryButtonText={patterRecognitionLocalisationStrings.gotIt}
            secondaryButtonText={patterRecognitionLocalisationStrings.cancel}
            onRequestSubmit={() => goToPath(dashboardPatternRecognitionPath)}
            onSecondarySubmit={() => setOpenTearsheet(false)}
            onRequestClose={() => setOpenTearsheet(false)}
            decorator={<LogPatternsAiLabel />}
            size="md"
          >
            <InitialModalScreen />
          </CarbonModal>
        )}
      </div>
    </LoggingDashboardWrapper>
  );
}
