/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { HorizontalIndicator, LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { retentionLogsGET } from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/RetentionPeriod';
import { dashboardRetentionConfigurationPath } from 'in-logging/navigation/paths';
import KpiCard, { IconAction } from 'in-components/KpiCard/KpiCard';
import { getEntityIdView } from 'in-settings/navigation/paths';
import { isAddonUserCached } from 'in-logging/api/licence';
import { role } from 'in-stores/user';
import { Progress } from 'in-types';
import { t } from 'in-i18n';

import locals from './RetentionPeriod.mless';

const localisationStrings = {
  currentRetentionPeriod: t('in-settings:tabs.retentionPeriod.currentRetentionPeriod'),
  days: t('in-settings:tabs.retentionPeriod.days')
};
export default function RetentionPeriodDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [retentionValue, setRetentionValue] = useState<number | undefined | string>();
  const progress: Progress = {
    loading: isLoading
  };

  const logRetentionHrefToLogginHomepage = useObservable(getEntityIdView(dashboardRetentionConfigurationPath, ''), []);

  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  const logRetentionIcon: IconAction | undefined =
    role?.canConfigureLogRetentionPeriod && isLoggingAddonUser
      ? {
          text: t('in-logging:dashboard.retentionIcon'),
          kind: 'subtle',
          icon: 'lib_actions_edit',
          href: logRetentionHrefToLogginHomepage || ''
        }
      : undefined;

  const getRetentionPeriod$ = retentionLogsGET();

  getRetentionPeriod$.once(response => {
    setRetentionValue(response.body.retentionDays);
    setIsLoading(false);
  });
  getRetentionPeriod$.errors().once(_ => {
    setIsLoading(false);
  });

  return (
    <>
      {!isLoading ? (
        <KpiCard title={localisationStrings.currentRetentionPeriod} iconAction={logRetentionIcon} noTooltipOnTitle>
          <div className={locals.body}>
            <p className={locals.retentionContent}>
              <span data-testid="retentionValue" className={locals.number}>
                {retentionValue}
              </span>
              {localisationStrings.days}
            </p>
          </div>
        </KpiCard>
      ) : (
        <>
          <HorizontalIndicator className={locals.loadingIndicator} progress={progress} />
          <LoadingSkeleton className={locals.skeleton} />
        </>
      )}
    </>
  );
}
