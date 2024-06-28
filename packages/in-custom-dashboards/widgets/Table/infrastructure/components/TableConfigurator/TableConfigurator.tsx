/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React, { useMemo } from 'react';

import { Li, Spacer, Stack, Checkbox } from '@instana/components';

import {
  datasets,
  tagFilterExpression as tagFilterExpressionFieldName,
  metric as metricFieldName,
  metricLabel,
  aggregation as aggregationFieldName,
  grouping,
  countGroup,
  showGroupsWithMissingTags,
  entityType as entityTypeFieldName,
  crossSeriesAggregation as crossSeriesAggregationFieldName
} from 'in-custom-dashboards/widgets/Table/infrastructure/form';
// @ts-expect-error
import { MetricsForAxis as MetricsForColumns } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import TableSizeConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import SortingConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/SortingConfigurator';
// @ts-expect-error
import { Reorderer } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import FilterConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/FilterConfigurator';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Table/infrastructure/components/DatasetsColumn';
import GroupConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/GroupConfigurator';
import { metricsPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import { Group, TagCatalog } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator.mless';

export interface Metric {
  value: string;
  label: string;
}

interface TableConfiguratorProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
  tagFilterExpression: FormModelElement[];
  tagCatalog?: TagCatalog;
  entityLabel: string | null;
}

export default function TableConfigurator({
  form,
  onChange,
  updateForm,
  setTagFilterExpression,
  tagFilterExpression,
  tagCatalog,
  entityLabel
}: TableConfiguratorProps) {
  const tagFilterExpressionFieldValue = form.get(tagFilterExpressionFieldName)?.value;
  const counterField = form.get(countGroup)?.value;
  const showGroupsWithMissingTagsField = form.get(showGroupsWithMissingTags)?.value;
  const datasetsColumnsField = form.get(datasets);
  const metricsSize = datasetsColumnsField.get(metricsPath).size;
  const groups = form.get(grouping).value;
  const ownerType = form.get(entityTypeFieldName).value;

  const isMetricsEnabled = metricsSize > 0;
  const metrics = getMetrics(datasetsColumnsField.get(metricsPath));

  const sortingOptions: Metric[] = useMemo(
    () => getSortingOptions(entityLabel, metrics, groups),
    [entityLabel, groups, metrics]
  );

  const isSortingEnabled = sortingOptions.length > 0;
  const isGroup = groups && groups?.length > 0;

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.table.form.infrastructure.tableConfiguration')}</Header>
      <Sections>
        <Li component="div">{t('in-custom-dashboards:widgets.table.form.infrastructure.tableDetails')}</Li>
        <Li component="div" className={locals.content}>
          <Stack gap="xsmall">
            <Sections>
              <FilterConfigurator
                tagFilterExpression={tagFilterExpression}
                setTagFilterExpression={setTagFilterExpression}
                tagCatalog={tagCatalog}
                ownerType={ownerType}
              />
            </Sections>

            <Sections>
              <GroupConfigurator
                form={form}
                updateForm={updateForm}
                tagFilterExpression={tagFilterExpressionFieldValue ?? tagFilterExpression}
                tagCatalog={tagCatalog}
                ownerType={ownerType}
              />
            </Sections>

            {isGroup && (
              <Sections>
                <Section title={t('in-custom-dashboards:widgets.table.form.infrastructure.countGroup')}>
                  <Stack direction="horizontal" align="center" distribution="stretch" gap="large">
                    <Checkbox
                      checked={counterField}
                      onChange={({ target }) =>
                        updateForm(
                          form.updateIn([countGroup], field => field.setValue(target.checked).setTouched(true))
                        )
                      }
                    />
                  </Stack>
                </Section>
                <Section title={t('in-custom-dashboards:widgets.table.form.infrastructure.showGroupsWithMissingTags')}>
                  <Stack direction="horizontal" align="center" distribution="stretch" gap="large">
                    <Checkbox
                      checked={showGroupsWithMissingTagsField}
                      onChange={({ target }) =>
                        updateForm(
                          form.updateIn([showGroupsWithMissingTags], field =>
                            field.setValue(target.checked).setTouched(true)
                          )
                        )
                      }
                    />
                  </Stack>
                </Section>
              </Sections>
            )}

            <Sections>
              <TableSizeConfigurator form={form} updateForm={updateForm} />
            </Sections>

            {isMetricsEnabled && (
              <>
                <Spacer vertical="normal" />
                <Reorderer form={form} onChange={onChange}>
                  <MetricsForColumns
                    form={form}
                    onChange={onChange}
                    axisName={datasets}
                    startIndex={0}
                    getShortMetricKey={(_: string, index: number) => getShortMetricKey('C', index)}
                    isColorConfiguratorEnabled={false}
                  />
                </Reorderer>
              </>
            )}

            {isSortingEnabled && (
              <Sections>
                <SortingConfigurator form={form} updateForm={updateForm} sortingOptions={sortingOptions} />
              </Sections>
            )}
          </Stack>
        </Li>
      </Sections>
    </Stack>
  );
}

function getMetrics(metrics: Metric[]) {
  if (metrics.length === 0) {
    return [];
  }

  return metrics.reduce((output: Metric[], field: any) => {
    const metric = field.get(metricFieldName).value;
    const label = field.get(metricLabel).value;
    const aggregation = field.get(aggregationFieldName).value;
    const crossSeriesAggregation = field.get(crossSeriesAggregationFieldName)?.value;

    if (metric !== '') {
      output.push({ value: `${metric}.${aggregation}.${crossSeriesAggregation}`, label: label });
    }

    return output;
  }, []);
}

function getSortingOptions(entityLabel: string | null, metrics: Metric[], groups: Group[]) {
  if (!entityLabel) {
    return [];
  }

  const hasGroups = groups.length > 0;
  const entityNameOption = [
    {
      value: 'label',
      label: `${entityLabel || ''} ${t('in-custom-dashboards:widgets.table.form.infrastructure.defaultSortingSuffix')}`
    }
  ];

  const sortingOptions = hasGroups ? getGroupsSortingOptions(groups) : entityNameOption;

  return [...sortingOptions, ...metrics];
}

function getGroupsSortingOptions(groups: Group[]): { value: string; label: string }[] {
  return toBackendGroupBy(groups).map(g => ({ value: g, label: g }));
}
