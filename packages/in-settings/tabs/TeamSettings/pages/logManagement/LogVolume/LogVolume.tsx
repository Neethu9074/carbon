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

// eslint-disable-next-line no-restricted-imports
import LogVolumeGroupingConfigurator from './workspaces/LogVolumeGroupingConfigurator';
import {
  generateQuery,
  TagNames,
  TagObject,
  transformData
} from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/utils';
import LogVolumeDetails from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/LogVolumeDetails';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { ua2GroupChangedTracker } from 'in-applications/tracker';
import { dataSource } from 'in-applications/navigation/matrix';
import Select from 'in-components/form/Select/Select';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

import locals from './LogVolume.mless';

const localisationStrings = {
  logVolume: t('in-settings:tabs.logVolume.logVolume'),
  timeRange: t('in-settings:tabs.logVolume.timeRange')
};

const defaultProps = {
  backendQueryModel: {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  }
};

const DEFAULT_TAG_NAME: TagNames = '';

function LogVolume() {
  const [timePeriod, setTimePeriod] = useState<number>(1);
  const [groupingTag, setGroupingTag] = useState<TagNames>(DEFAULT_TAG_NAME);
  const [groupValue, setGroupValue] = useState<TagObject | null>(null);

  const result = useObservable(
    ([timePeriod, groupingTag]: [number, TagNames]) => {
      return combineLatest([getUnifiedMetrics(generateQuery(timePeriod, groupingTag))]).map(([result]) => ({
        progress: result?.progress || false,
        data: result?.data || []
      }));
    },
    [timePeriod, groupingTag]
  );

  const { progress, data } = result || { progress: { loading: false }, data: [] };

  const logVolumeData = result && transformData(data);

  const onChangeGroup = (param: TagObject | null) => {
    const newTag = param ? param.groupbyTag : DEFAULT_TAG_NAME;
    setGroupValue(param);
    setGroupingTag(newTag);
  };
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
              <GroupingConfiguratorSection
                value={groupValue}
                onChange={onChangeGroup}
                GroupingConfigurator={LogVolumeGroupingConfigurator}
                tagFilterExpression={defaultProps.backendQueryModel || toBackendQueryModel([])}
                tracking={{
                  onGroupAdded: group => ua2GroupChangedTracker({ dataSource, tagName: group.groupbyTag })
                }}
              />
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
