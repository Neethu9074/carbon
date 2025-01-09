/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, createMapForm } from 'formalistic';

import {
  createEntityField,
  createGroupField,
  createSortingField,
  createTableSizeField,
  createCountGroupField,
  createShowGroupsWithMissingTagsField
} from 'in-custom-dashboards/widgets/Table/infrastructure/form';
// @ts-expect-error needs ts migration
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import {
  createColumnsField,
  createDynamicFocusQueryField,
  createColumnsFieldForKubernetes
} from 'in-custom-dashboards/widgets/Table/eventsTable/form';
// @ts-expect-error needs ts migration
import { createAxisForm as createColumnForm } from 'in-custom-dashboards/widgets/Chart/form';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';

export function createForm(savedState: Partial<TableFormConfiguration>) {
  const source = savedState?.source ?? '';

  let form: MapForm<any> = createMapForm({
    items: {
      source: createField<string>({
        value: source,
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      }),
      ...(source === dataSources.EVENTS.type && {
        dynamicFocusQuery: createDynamicFocusQueryField(savedState),
        columns: createColumnsField(savedState)
      }),
      ...(source === dataSources.KUBERNETES_EVENTS.type && {
        dynamicFocusQuery: createDynamicFocusQueryField(savedState),
        columns: createColumnsFieldForKubernetes(savedState)
      }),
      ...(source === dataSources.INFRA.type && {
        grouping: createGroupField(savedState),
        entityType: createEntityField(savedState),
        tableSize: createTableSizeField(savedState),
        datasets: createColumnForm(savedState && savedState.datasets, false, true, {
          withLabelConfiguration: true,
          withCompareToTimeShifted: true,
          withEnablePotentialProblems: true,
          withColorConfiguration: true,
          withMetricFormatter: true,
          withRenderer: false,
          withFormatter: false,
          withEmptyValueFilter: true,
          withThresholdConfiguration: true
        }),
        sorting: createSortingField(savedState),
        countGroup: createCountGroupField(savedState),
        showGroupsWithMissingTags: createShowGroupsWithMissingTagsField(savedState)
      })
    }
  });

  if (source === dataSources.INFRA.type) {
    form = addTagFilterExpressionField(form, savedState);
  }

  return form;
}
