/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonLayer, Li, SvgIcon, Typography, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';
import { Result } from '@instana/types';

import LogVolumeGroupingConfigurator from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/workspaces/LogVolumeGroupingConfigurator';
import { generateQuery, getLabelByName } from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/utils';
import LogVolumeDetails from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/LogVolumeDetails';
import { TagNames, TagObject } from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/types';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getLogVolumeReport, GetVolumeReportData } from 'in-logging/api/logVolume';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { dataSource } from 'in-applications/navigation/matrix';
import useUrlState, { Options } from 'in-hooks/useUrlState';
import Select from 'in-components/form/Select/Select';
import { hasError } from 'in-services/util/result';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

import locals from './LogVolume.mless';

export const localisationStrings = {
  logVolume: t('in-settings:tabs.logVolume.logVolume'),
  timeRange: t('in-settings:tabs.logVolume.timeRange'),
  timeRangeAndGroup: t('in-settings:tabs.logVolume.timeRangeAndGroup'),
  content: t('in-settings:tabs.logVolume.content')
};

const defaultProps = {
  backendQueryModel: {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  }
};

const urlStateDefinition: Options<{ timePeriod: number; groupingTag: TagNames | null }> = {
  bind: [
    {
      path: '/logVolume',
      name: 'timePeriod',
      as: 'timePeriod',
      initialState: 1,
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    },
    {
      path: '/logVolume',
      name: 'groupingTag',
      as: 'groupingTag',
      initialState: '',
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    }
  ],
  reducer: (prevState, { timePeriod, groupingTag }) => ({
    timePeriod: timePeriod ?? prevState.timePeriod,
    groupingTag: groupingTag ?? prevState.groupingTag
  })
};

export function LogVolume() {
  const [{ groupingTag, timePeriod }, setUrlState] = useUrlState(urlStateDefinition);

  const setGroupingTag = (newGroupingTag: TagNames | null) => {
    setUrlState({
      groupingTag: newGroupingTag === null ? '' : newGroupingTag,
      timePeriod
    });
  };

  const setTimePeriod = (newTimePeriod: number) => {
    setUrlState({
      groupingTag,
      timePeriod: newTimePeriod
    });
  };

  const result = (useObservable<Result<GetVolumeReportData>, [number, string | null]>(
    () => getLogVolumeReport(generateQuery(timePeriod, groupingTag)),
    [timePeriod, groupingTag]
  ) ?? { errors: [], progress: { loading: true }, data: {} }) as Result<GetVolumeReportData>;

  const { progress, data } = result;

  const { trackUa2GroupChanged } = useAnalyzeTracker();

  const groupingConfiguratorValue = groupingTag
    ? ({
        groupbyTag: groupingTag as string
      } as TagObject)
    : null;

  return (
    <>
      <section className={locals.page}>
        <Title title={localisationStrings.logVolume} />
        <section className={locals.titleSection}>
          <SubViewHeader>{localisationStrings.logVolume}</SubViewHeader>
        </section>
        <div>
          <section aria-label={localisationStrings.timeRangeAndGroup}>
            <Ul>
              <Li>
                <CarbonLayer>
                  <div className={locals.timeRange}>
                    <Label htmlFor="timeRange">
                      <SvgIcon type="lib_datetime_date" />
                      {localisationStrings.timeRange}
                    </Label>
                    <Select
                      id="timeRange"
                      name="timeRange"
                      value={timePeriod}
                      onChange={e => setTimePeriod(+e.target.value)}
                    >
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
                data-testid="groupingConfiguration"
                value={groupingConfiguratorValue}
                onChange={(tag: TagObject) => {
                  if (tag?.groupbyTag) {
                    setGroupingTag(tag.groupbyTag as TagNames);
                  } else setGroupingTag(null);
                }}
                GroupingConfigurator={LogVolumeGroupingConfigurator}
                tagFilterExpression={defaultProps.backendQueryModel || toBackendQueryModel([])}
                tracking={{
                  onGroupAdded: group => trackUa2GroupChanged({ dataSource, tagName: group.groupbyTag })
                }}
              />
            </Ul>
          </section>
          <section>
            {hasError(result) ? (
              <section className={locals.stateContainer}>
                <div data-testid="logVolumeDataError" className={locals.noLogVolumeData}>
                  <SvgIcon type="lib_help_error_error_circle" size="xxxl" />
                  <Typography variant="body-bold">{t('in-settings:tabs.logVolume.logVolumeErrorTitle')}</Typography>
                  <Typography variant="body-regular">{t('in-settings:tabs.logVolume.logVolumeErrorInfo')}</Typography>
                </div>
              </section>
            ) : (
              <LogVolumeDetails
                key={`${timePeriod}-${groupingTag}`}
                progress={progress}
                data={data?.logVolumeUsageItems}
                timePeriod={timePeriod}
                groupingTag={groupingTag ? getLabelByName(groupingTag) ?? '' : ''}
              />
            )}
          </section>
        </div>
      </section>
    </>
  );
}

export default LogVolume;
