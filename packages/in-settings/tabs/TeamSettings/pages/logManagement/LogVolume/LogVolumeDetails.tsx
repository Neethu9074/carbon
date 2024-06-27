/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Li, Ul } from '@instana/components';

import {
  LogVolumeData,
  LogVolumeDetailsProps
} from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/types';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { t } from 'in-i18n';

import locals from './LogVolumeDetails.mless';

export default function LogVolumeDetails({ data }: LogVolumeDetailsProps) {
  return (
    <>
      {data &&
        data.map(({ month, totalVolumeGB, retentionPeriods }: LogVolumeData, index: number) => (
          <div key={`${month}_${index}`} className={locals.LogVolumeDetailsContainer}>
            <Li className={locals.LogVolumeDetails}>
              <SubViewHeader>{t('in-settings:maintenanceWindow.months', { context: month })}</SubViewHeader>
              <SubViewHeader>{totalVolumeGB} GB</SubViewHeader>
            </Li>
            <div>
              <Ul className={locals.logVolumeItems}>
                {(['days7', 'days20', 'days30'] as const).map(days => (
                  <Li>
                    <div>{t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}</div>
                    <div>{retentionPeriods[days]} GB</div>
                  </Li>
                ))}
              </Ul>
            </div>
          </div>
        ))}
    </>
  );
}
