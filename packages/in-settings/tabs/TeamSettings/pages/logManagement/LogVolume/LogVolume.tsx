/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { CarbonLayer, Li, SvgIcon, Ul } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { generateQuery, transformData } from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/utils';
import LogVolumeDetails from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/LogVolumeDetails';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import SubViewHeader from 'in-settings/components/SubViewHeader';
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
      return combineLatest([getUnifiedMetrics(generateQuery(timePeriod))]).map(([result]) => ({
        progress: result?.progress || false,
        data: result?.data || [] // Obtiene los datos
      }));
    },
    [timePeriod]
  );

  const { progress, data } = result || { progress: { loading: false }, data: [] };

  const logVolumeData = result && transformData(data);
  return (
    <>
      <section className={locals.page}>
        <Title title={localisationStrings.logVolume} />
        <section className={locals.titleSection}>
          <SubViewHeader>{localisationStrings.logVolume}</SubViewHeader>
        </section>
        <main>
          <section>
            <Ul>
              <Li>
                <CarbonLayer>
                  <div className={locals.timeRange}>
                    <Label htmlFor="timeRange">
                      <SvgIcon type="lib_datetime_date" />
                      {localisationStrings.timeRange}
                    </Label>
                    <Select name="timeRange" value={timePeriod} onChange={e => setTimePeriod(+e.target.value)}>
                      {[1, 3, 6, 9, 12].map(months => (
                        <option key={months} value={months}>
                          {t('in-settings:tabs.logVolume.months', { context: String(months) })}
                        </option>
                      ))}
                    </Select>
                  </div>
                </CarbonLayer>
              </Li>
            </Ul>
          </section>
          <section>
            <LogVolumeDetails data={logVolumeData} progress={progress} timePeriod={timePeriod} />
          </section>
        </main>
      </section>
    </>
  );
}

export default LogVolume;
