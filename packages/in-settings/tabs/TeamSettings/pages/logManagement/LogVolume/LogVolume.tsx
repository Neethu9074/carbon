/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { combineLatest, just } from '@instana/observables';
import { Li, SvgIcon, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import {
  generateQueries,
  getLogVolume,
  transformData
} from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/utils';
import LogVolumeDetails from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/LogVolumeDetails';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import Select from 'in-components/form/Select/Select';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

import locals from './LogVolume.mless';

const localisationStrings = {
  logVolume: t('in-settings:tabs.logVolume.logVolume'),
  timeRange: t('in-settings:tabs.logVolume.timeRange')
};

function LogVolume() {
  const [timePeriod, setTimePeriod] = useState<number>(1);

  const result = useObservable(
    ([timePeriod]) => {
      return combineLatest(
        generateQueries(timePeriod).map(query => getLogVolume(query.metrics['y1-0'].timeConfig))
      ).flatMap(data => just(data.flatMap(({ data = [] }) => data)));
    },
    [timePeriod]
  );

  const logVolumeData = result && transformData(result);
  return (
    <>
      <SettingsDetailPage className={locals.page}>
        <Title title={localisationStrings.logVolume} />
        <section>
          <SubViewHeader>{localisationStrings.logVolume}</SubViewHeader>
          <SectionLine />
        </section>
        <main>
          <section>
            <Ul>
              <Li>
                <div className={locals.timeRange}>
                  <Label htmlFor="timeRange">
                    <SvgIcon type="lib_datetime_date" />
                    {localisationStrings.timeRange}
                  </Label>
                  <Select name="timeRange" value={timePeriod} onChange={e => setTimePeriod(+e.target.value)}>
                    {[1, 3, 6, 9, 12].map(months => (
                      <option value={months}>
                        {t('in-settings:tabs.logVolume.months', { context: String(months) })}
                      </option>
                    ))}
                  </Select>
                </div>
              </Li>
            </Ul>
          </section>
          <section>
            <LogVolumeDetails data={logVolumeData} />
          </section>
        </main>
      </SettingsDetailPage>
    </>
  );
}

export default LogVolume;
