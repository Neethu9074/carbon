/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import { find } from 'lodash';

import { migrate as migrateTagFilterArray } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import * as queryBuildersPerDataSource from 'in-websites/queryBuilder';
import { notBlankValidator } from 'in-services/validators/string';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';
import { emptyObject } from 'in-services/fixedObjects';
import { dataSourceTitles } from 'in-websites/tags';

export function createForm(form, savedState) {
  return addTagFilterExpressionField(form, savedState).put(
    'beaconType',
    createField({
      value: savedState?.beaconType || 'pageLoad',
      validator: composeAndShortCircuitOnError(
        notUndefinedValidator,
        stringValidator,
        notBlankValidator,
        buildEnumValidator(Object.keys(dataSourceTitles))
      )
    })
  );
}

export function getBeaconType(tagFilterArray) {
  const tagFilter = find(tagFilterArray, ({ name }) => name === 'beacon.type');
  if (tagFilter == null) {
    return '';
  }
  return tagFilter.stringValue;
}

export function migrate(savedState) {
  const beaconType =
    savedState.beaconType || savedState.tagFilters?.find(({ name }) => name === 'beacon.type') || 'pageLoad';
  const { getTagCatalog } = queryBuildersPerDataSource[beaconType] || emptyObject;

  return migrateTagFilterArray({
    savedState: {
      ...savedState,
      beaconType
    },
    getTagCatalog,
    // Within the tag filters based variant of this data source configuration, we used to
    // store the beacon type as part of the tag filters array. This was done to have a
    // cleaner backend API. This "cleaner" API turned out to create more work than it provided
    // value in the end and is getting removed with the introduction of tag filter expressions.
    modifyTagFilterArrayBeforeConversion: tagFilters => tagFilters.filter(({ name }) => name !== 'beacon.type')
  });
}
