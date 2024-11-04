/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { HorizontalIndicator, LoadingSkeleton } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import { generateQueryWithWinSize } from 'in-logging/dashboard/utils';
import { getEntityIdView, globalSettingsLogManagementLogVolume } from 'in-settings/navigation/paths';
import { transformData } from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/utils';
import KpiCard, { IconAction } from 'in-components/KpiCard/KpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { isAddonUserCached } from 'in-logging/api/licence';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './LogVolume.mless';

const localisationStrings = {
  logVolumeTitle: t('in-logging:dashboard.logVolume.logVolumeTitle'),
  GB: t('in-logging:dashboard.logVolume.gb')
};

const placeholderTimeConfig = { to: null, windowSize: 1, autoRefresh: false };

export default function LogVolumeDashboard() {
  const timeConfig = useTimeConfig();
  const [timePeriod, setTimePeriod] = useState<TimeConfig>(placeholderTimeConfig);

  useEffect(() => {
    setTimePeriod(timeConfig);
  }, [timeConfig]);

  const logVolumeHref = useObservable(getEntityIdView(globalSettingsLogManagementLogVolume, ''), []);
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  const logVolumeIcon: IconAction | undefined =
    role?.canViewLogVolume && isLoggingAddonUser
      ? {
          text: t('in-logging:dashboard.logVolume.logVolumeIcon'),
          kind: 'subtle',
          icon: 'lib_analyze',
          href: logVolumeHref || ''
        }
      : undefined;

  const result = useObservable(
    ([timePeriod]: [TimeConfig]) => {
      return combineLatest([getUnifiedMetrics(generateQueryWithWinSize(timePeriod.windowSize))]).map(([result]) => ({
        progress: result?.progress || false,
        data: result?.data || [],
        errors: result?.errors || []
      }));
    },
    [timePeriod]
  );

  const { progress, data } = result || { progress: { loading: false }, data: [] };
  const logVolumeData = result && transformData(data);

  return (
    <>
      {!progress.loading ? (
        <KpiCard title={localisationStrings.logVolumeTitle} iconAction={logVolumeIcon} noTooltipOnTitle>
          <div className={locals.body}>
            <p className={locals.retentionContent}>
              <span data-testid="retentionValue" className={locals.number}>
                {logVolumeData?.[0]?.totalVolume?.gb ?? t('in-logging:dashboard.noData')}
              </span>{' '}
              {logVolumeData && localisationStrings.GB}
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
