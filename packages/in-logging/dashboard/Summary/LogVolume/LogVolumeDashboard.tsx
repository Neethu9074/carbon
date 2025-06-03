/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { HorizontalIndicator, LoadingSkeleton, Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import { dashboardLogVolumePath } from 'in-logging/navigation/paths';
import { bytesToLargerUnit } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import KpiCard, { IconAction } from 'in-components/KpiCard/KpiCard';
import { getLogVolumeReport } from 'in-logging/api/logVolume';
import { isAddonUserCached } from 'in-logging/api/licence';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './LogVolume.mless';

const localisationStrings = {
  logVolumeTitle: t('in-logging:dashboard.logVolume.logVolumeTitle'),
  GB: t('in-logging:dashboard.logVolume.gib'),
  TB: t('in-logging:dashboard.logVolume.tib')
};

const placeholderTimeConfig = { to: null, windowSize: 1, autoRefresh: false };

export default function LogVolumeDashboard() {
  const timeConfig = useTimeConfig();
  const { createHrefToPath } = useNavigation();
  const [timePeriod, setTimePeriod] = useState<TimeConfig>(placeholderTimeConfig);

  useEffect(() => {
    setTimePeriod(timeConfig);
  }, [timeConfig]);

  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  const logVolumeIcon: IconAction | undefined =
    role?.canViewLogVolume && isLoggingAddonUser
      ? {
          text: t('in-logging:dashboard.logVolume.logVolumeIcon'),
          kind: 'subtle',
          icon: 'lib_analyze',
          href: createHrefToPath(dashboardLogVolumePath)
        }
      : undefined;
  const currentSecondsTimestamp = Math.floor(Date.now() / 1000);
  const result = useObservable(
    () => getLogVolumeReport({ toTs: currentSecondsTimestamp, fromTs: currentSecondsTimestamp }),
    [timePeriod]
  );

  const { progress, data, errors } = result || { progress: { loading: false }, data: {} };
  const logVolume = data?.logVolumeUsageItems?.[0]?.logVolume;

  return (
    <>
      {progress.loading ? (
        <>
          <HorizontalIndicator className={locals.loadingIndicator} progress={progress} />
          <LoadingSkeleton className={locals.skeleton} />
        </>
      ) : errors && errors?.length > 0 ? (
        <KpiCard title={localisationStrings.logVolumeTitle} noTooltipOnTitle iconClassName={locals.error}>
          <Stack align="center" distribution="center">
            <span title={errors[0].message}>
              <SvgIcon size="l" type="lib_help_error_error_circle" className={locals.error} />
            </span>
          </Stack>
        </KpiCard>
      ) : (
        <KpiCard title={localisationStrings.logVolumeTitle} iconAction={logVolumeIcon} noTooltipOnTitle>
          <div className={locals.body}>
            <p className={locals.retentionContent}>
              <span data-testid="retentionValue" className={locals.number}>
                {bytesToLargerUnit(logVolume ?? 0, 2)?.amount}
              </span>{' '}
              {bytesToLargerUnit(logVolume ?? 0, 2)?.localizedUnit}
            </p>
          </div>
        </KpiCard>
      )}
    </>
  );
}
