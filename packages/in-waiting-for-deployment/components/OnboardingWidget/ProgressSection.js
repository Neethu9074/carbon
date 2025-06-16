/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProgressInformation from 'in-waiting-for-deployment/components/OnboardingWidget/ProgressInformation';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from './ProgressSection.mless';

export default function ProgressSection(props) {
  return (
    <div className={locals.carbonSection}>
      <div className={locals.leftContent}>
        <div>{getText(props)}</div>
      </div>

      <ProgressInformation {...props} />
    </div>
  );
}

function getText({ isBackendAvailable, isAgentDeployed }) {
  if (isAgentDeployed) {
    return (
      <>
        <span className={locals.description}>
          {t('in-waiting-for-deployment:agentsAreReportingDataIsBeingCollected')}
        </span>
        <br />
        <span className={locals.description}>{t('in-waiting-for-deployment:timeToExploreInstana')}</span>
      </>
    );
  }
  if (isBackendAvailable) {
    return (
      <>
        <span className={locals.description}>
          {t('in-waiting-for-deployment:yourInstanaInstanceIsReadyAndWorksBestWithLotsOfData')}
        </span>
        <br />
        <span className={locals.description}>
          {newOTelPageEnabled
            ? t('in-waiting-for-deployment:weAreWaitingForYouToInstallAnInstanaAgentOrCollector')
            : t('in-waiting-for-deployment:letSGetSomeAgentsRunning')}
        </span>
      </>
    );
  }
  return (
    <>
      <span className={locals.description}>
        {t('in-waiting-for-deployment:whileWeArePreparingYourInstanaInstance')}
      </span>
      <br />
      <span className={locals.description}>
        {t('in-waiting-for-deployment:getReadyToDeployAgentsInYourEnvironment')}
      </span>
    </>
  );
}
