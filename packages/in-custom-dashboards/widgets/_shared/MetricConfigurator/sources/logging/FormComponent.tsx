/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Stack, Select } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Tag } from '@instana/types';

//@ts-expect-error needs ts migration
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
//@ts-expect-error needs ts migration
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
//@ts-expect-error needs ts migration
import { isRequiringGroupingConfiguration } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
//@ts-expect-error needs ts migration
import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import LogGroupingConfigurator from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
//@ts-expect-error needs ts migration
import { aggregationLabels } from 'in-stores/metric';
import QueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import { SortDirection } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import { getTagCatalog } from 'in-logging/api/catalog';
import Section from 'in-components/workspace/Section';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

interface FormComponentProps {
  dataSourceSection: JSX.Element;
  formatterSection: JSX.Element;
  labelSection: JSX.Element;
  timeShiftConfiguration: JSX.Element;
  thresholdConfiguration: JSX.Element;
  form: MapForm<any>;
  onChange: any;
  withGrouping?: boolean;
  maxGrouping?: number;
}

const aggregations = ['SUM', 'PER_SECOND'];

export default function FormComponent({
  dataSourceSection,
  formatterSection,
  form,
  onChange,
  timeShiftConfiguration,
  thresholdConfiguration,
  labelSection,
  withGrouping = true,
  maxGrouping = 20
}: FormComponentProps) {
  const timeConfig = useTimeConfig();

  const tagCatalogResult = useObservable(() => getTagCatalog({ useCase: 'FILTERING' }), [timeConfig]) ?? pendingResult;

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const groupingField = form.get('grouping');
  const tagFilterExpressionField = form.get('tagFilterExpression');

  useEffect(() => {
    form.updateIn(['metric'], field => field.setValue('count'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouping = groupingField?.get(0)?.toJS();
  const onByChange = (by: Tag) => onChangeGrouping(onChange, { ...grouping, by });
  const onDirectionChange = (direction: SortDirection, maxResults: number, groupKey: string) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults }, groupKey);

  return (
    <Stack gap="xxsmall">
      <Sections>{dataSourceSection}</Sections>
      <Sections>
        <Section
          titleHtmlFor={'metic-configurator-application-metric'}
          title={t('in-custom-dashboards:widgets.srcLogging.formComponent.metric')}
        >
          <Tooltip align="bottomLeft" content={t('in-custom-dashboards:widgets.srcLogging.formComponent.onlyMetric')}>
            <div>
              <Select disabled value={metricField.value}>
                <>
                  <option value="count">
                    {t('in-custom-dashboards:widgets.srcLogging.formComponent.metrics.count')}
                  </option>
                </>
              </Select>
            </div>
          </Tooltip>
        </Section>
      </Sections>
      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcLogging.formComponent.aggregation')}
          id="metic-configurator-application-aggregation"
          value={aggregationField.value}
          onChange={e =>
            onChange(['aggregation'], (field: Field<string>) => field.setValue(e.target.value).setTouched(true))
          }
          hasError={!aggregationField.valid && aggregationField.touched}
          additionalContent={<TouchedMessages field={metricField} />}
          useAlternateBg
        >
          <option value="">{t('in-custom-dashboards:widgets.srcLogging.formComponent.pleaseSelect')}</option>
          {aggregations.map(aggregation => (
            <option key={aggregation} value={aggregation}>
              {aggregationLabels[aggregation]}
            </option>
          ))}
        </SelectInSection>

        {formatterSection}
      </Sections>

      <Sections>
        <QueryBuilderSection
          value={tagFilterExpression}
          onChange={setTagFilterExpression}
          QueryBuilder={QueryBuilder}
          useLastValidStateWhenErroneous
          withoutIcon
          source="logs"
          getSuggestionLabel={({ item, tagName }) =>
            tagName === 'technology' ? `${getPluginName(item)} (${item})` : item
          }
        />
      </Sections>

      <GroupingConfiguration
        hideIncludeOthersToggle
        withGrouping={withGrouping}
        grouping={grouping}
        tagFilterExpressionField={tagFilterExpressionField}
        onByChange={onByChange}
        onDirectionChange={onDirectionChange}
        GroupingConfigurator={LogGroupingConfigurator}
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
        maxGrouping={maxGrouping}
      />

      {timeShiftConfiguration}

      {thresholdConfiguration}

      {labelSection}
    </Stack>
  );
}
