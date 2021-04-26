/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  EXPRESSION,
  OPERATOR_AND,
  toBackendQueryModel
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import FacetedExpandableCard from 'in-new-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import ExistingValue from 'in-new-components/AnalyzeView/FacetedFilters/ExistingValue';
import { ua2FacetedSearchFilterAddedTracker } from 'in-new-components/tracker';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { emptyArray } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import Link from 'in-components/Link';

import locals from './FacetedFilterRangeList.mless';

export default function FacetedFilterRangeList({
  title,
  tag,
  formModel,
  getUpdatedTagExpressionHref,
  ranges,
  openByDefault,
  dataSource
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault} tag={tag} dataSource={dataSource}>
      <Body
        tag={tag}
        formModel={formModel}
        ranges={ranges}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
        dataSource={dataSource}
      />
    </FacetedExpandableCard>
  );
}

function Body({ tag, formModel, ranges, getUpdatedTagExpressionHref, dataSource }) {
  const currentFilters = getExistingFiltersForTag(tag, formModel);
  const selectedRanges =
    currentFilters &&
    ranges.filter(range => {
      const hasStart = currentFilters.find(
        filter => filter.value === range.start && filter.operator === GREATER_OR_EQUAL_THAN
      );
      const hasEnd = currentFilters.find(
        filter => filter.value === range.end && filter.operator === LESS_OR_EQUAL_THAN
      );
      return hasStart && hasEnd;
    });
  if (selectedRanges?.length > 0) {
    return (
      <SelectedRanges
        tag={tag}
        selectedRanges={selectedRanges}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
      />
    );
  }
  return (
    <Stack space="small">
      {ranges.map(range => (
        <Suggestion
          tag={tag}
          key={range.start}
          range={range}
          getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
          dataSource={dataSource}
        />
      ))}
    </Stack>
  );
}

function getExistingFiltersForTag(tag, formModel) {
  const backendModel = toBackendQueryModel(formModel);
  return backendModel.type === EXPRESSION && backendModel.logicalOperator === OPERATOR_AND
    ? backendModel.elements.filter(element => element.type === TAG_FILTER_TYPE && element.name === tag)
    : emptyArray;
}

function SelectedRanges({ tag, selectedRanges, getUpdatedTagExpressionHref }) {
  return (
    <>
      {selectedRanges.map(range => (
        <ExistingValue
          key={range.label}
          value={range.label}
          removeLink={getUpdatedTagExpressionHref({
            remove: [
              {
                type: TAG,
                name: tag,
                operator: GREATER_OR_EQUAL_THAN,
                value: range.start
              },
              {
                type: TAG,
                name: tag,
                operator: LESS_OR_EQUAL_THAN,
                value: range.end
              }
            ]
          })}
        />
      ))}
    </>
  );
}

function Suggestion({ tag, range, getUpdatedTagExpressionHref, dataSource }) {
  return (
    <div className={locals.suggestion}>
      <Link
        href={getUpdatedTagExpressionHref({
          add: [
            {
              type: TAG,
              name: tag,
              operator: GREATER_OR_EQUAL_THAN,
              value: range.start
            },
            {
              type: TAG,
              name: tag,
              operator: LESS_OR_EQUAL_THAN,
              value: range.end
            }
          ]
        })}
        onClick={() => ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: tag })}
        style={{ textDecoration: 'none' }}
        className={locals.label}
      >
        {range.label}
      </Link>
    </div>
  );
}
