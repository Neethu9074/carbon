/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { CarbonLayer, Li, SvgIcon, Ul, Typography } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';
import { Result } from '@instana/types';

import LogVolumeGroupingConfigurator from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/workspaces/LogVolumeGroupingConfigurator';
import {
  generateQuery,
  getLabelByName,
  transformData
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/utils';
import LogVolumeDetails from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/LogVolumeDetails';
import { TagNames, TagObject } from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/types';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { dataSource } from 'in-applications/navigation/matrix';
import Select from 'in-components/form/Select/Select';
import { hasError } from 'in-services/util/result';
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

export function LogVolume() {
  const [timePeriod, setTimePeriod] = useState<number>(1);
  const [groupingTag, setGroupingTag] = useState<TagNames>(DEFAULT_TAG_NAME);
  const [groupingTagLabel, setGroupingTaglabel] = useState<string | null>(DEFAULT_TAG_NAME);
  const [groupValue, setGroupValue] = useState<TagObject | null>(null);
  const [expandedRetention, setExpandedRetention] = useState({});

  const result = useObservable(
    ([timePeriod, groupingTag]: [number, TagNames]) => {
      return combineLatest([getUnifiedMetrics(generateQuery(timePeriod, groupingTag))]).map(([result]) => ({
        progress: result?.progress || false,
        data: result?.data || [],
        errors: result?.errors || []
      }));
    },
    [timePeriod, groupingTag]
  );

  const { progress, data } = result || { progress: { loading: false }, data: [] };
  const logVolumeData = result && transformData(data);

  const handleUpdateExpandedRetention = (newState: any) => {
    setExpandedRetention(newState);
  };

  const onChangeGroup = (param: TagObject | null) => {
    const newTag = param ? param.groupbyTag : DEFAULT_TAG_NAME;
    const newTagLabel = param ? getLabelByName(param.groupbyTag) : DEFAULT_TAG_NAME;
    setGroupValue(param);
    setGroupingTag(newTag);
    setGroupingTaglabel(newTagLabel);
    handleUpdateExpandedRetention({});
  };
  const { trackUa2GroupChanged } = useAnalyzeTracker();
  return (
    <>
      <section className={locals.page}>
        <Title title={localisationStrings.logVolume} />
        <section className={locals.titleSection}>
          <SubViewHeader>{localisationStrings.logVolume}</SubViewHeader>
        </section>
        <div>
          <section>
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
                value={groupValue}
                onChange={onChangeGroup}
                GroupingConfigurator={LogVolumeGroupingConfigurator}
                tagFilterExpression={defaultProps.backendQueryModel || toBackendQueryModel([])}
                tracking={{
                  onGroupAdded: group => trackUa2GroupChanged({ dataSource, tagName: group.groupbyTag })
                }}
              />
            </Ul>
          </section>
          <section>
            {data?.length === 0 && !progress.loading ? (
              hasError(result as Result<any>) ? (
                <section className={locals.stateContainer}>
                  <div data-testid="logVolumeDataError" className={locals.noLogVolumeData}>
                    <SvgIcon type="lib_help_error_error_circle" size="xxxl" />
                    <Typography variant="body-bold">{t('in-settings:tabs.logVolume.logVolumeErrorTitle')}</Typography>
                    <Typography variant="body-regular">{t('in-settings:tabs.logVolume.logVolumeErrorInfo')}</Typography>
                  </div>
                </section>
              ) : (
                <div data-testid="noLogVolumeData" className={locals.noLogVolumeData}>
                  <SvgIcon type="lib_help_error_info_outline" size="xxxl" />
                  <Typography variant="body-bold"> {t('in-settings:tabs.logVolume.noLogVolumeData')}</Typography>
                </div>
              )
            ) : (
              <LogVolumeDetails
                data={logVolumeData}
                progress={progress}
                timePeriod={timePeriod}
                expandedRetention={expandedRetention}
                groupingTag={groupingTagLabel}
                handleUpdateExpandedRetention={handleUpdateExpandedRetention}
              />
            )}
          </section>
        </div>
      </section>
    </>
  );
}

export default LogVolume;
