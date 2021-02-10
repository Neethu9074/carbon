/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { empty } from '@instana/observables';
import rpt from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import { optionsPropType } from 'in-new-components/SortingConfigurator/SortingConfigurator';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { getAvailableMetrics } from 'in-new-components/AnalyzeView/metrics';
import FacetedSearch from 'in-new-components/AnalyzeView/FacetedSearch';
import Header from 'in-new-components/QueryBuilder/components/Header';
import useStableObjectIntance from 'in-hooks/useStableObjectIntance';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './UngroupedView.mless';

export const retrievalSize = 20;
export default function UngroupedAnalyzeView(props) {
  const backendQueryModel = useStableObjectIntance(props.backendQueryModel);

  const {
    getData,
    orderBy,
    onOrderByChange,
    withoutHeader,
    detailId,
    SplitScreenListItemContent,
    DetailView,
    isValid,
    selectableFields,
    fixedFields,
    onSelectableFieldsChange,
    metricCatalog,
    metricCatalogFilter,
    Presenter,
    formModel,
    dataSource,
    facetedSearchItems,
    getFacetedSearchSuggestions,
    onFormModelChange,
    getHrefWithTagFilterExpression,
    withSamplingTooltip
  } = props;

  const timeConfig = useTimeConfig();
  const cursorPaginationState = useCursorPagination(
    ({ cursor }) => (isValid ? getData({ timeConfig, orderBy, backendQueryModel, cursor }) : empty),
    [isValid, timeConfig, backendQueryModel, orderBy]
  );
  const { items, errors, progress, totalHits } = cursorPaginationState;

  const isLoading = props.isLoading || progress?.loading;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasErrors = !props.isLoading && errors?.length > 0;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasItems = !props.isLoading && items.length > 0;

  if (!props.isLoading && !isValid) {
    return null;
  }

  const onFacetedSearchChange = ({ add = emptyArray, remove = emptyArray }) =>
    onFormModelChange(
      joinExpressions({
        expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
      })
    );

  const getUpdatedTagExpressionHref = ({ add = emptyArray, remove = emptyArray }) =>
    getHrefWithTagFilterExpression(
      joinExpressions({
        expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
      })
    );

  if (detailId) {
    return (
      <DetailView
        {...props}
        {...cursorPaginationState}
        isLoading={isLoading}
        hasErrors={hasErrors}
        hasItems={hasItems}
        ListItemContent={SplitScreenListItemContent}
      />
    );
  }

  const availableMetrics = getAvailableMetrics({ metricCatalog, metricCatalogFilter, fixedFields });

  return (
    <>
      {!withoutHeader && (
        <Header
          {...props}
          order={orderBy}
          topText={t('in-new-components:analyzeView.ungroupedViewNoGrouping')}
          totalRepresentedItemCount={totalHits ?? 0}
          setOrder={onOrderByChange}
          availableMetrics={availableMetrics}
          metrics={selectableFields}
          setMetrics={metrics =>
            onSelectableFieldsChange(
              metrics.map(metric => ({
                // Converting metrics to fields by adding the type
                ...metric,
                type: metricType
              }))
            )
          }
          withSamplingTooltip={withSamplingTooltip}
        />
      )}

      <div className={locals.facetedSearchResultContainer}>
        {facetedSearchItems?.length > 0 && (
          <FacetedSearch
            facetedSearchItems={facetedSearchItems}
            formModel={formModel}
            onFacetedSearchChange={onFacetedSearchChange}
            getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
            dataSource={dataSource}
            isValid={isValid}
            getSuggestions={tag =>
              getFacetedSearchSuggestions({
                timeConfig,
                backendQueryModel,
                metricKey: 'facetedSearchMetric',
                group: {
                  groupbyTag: tag
                },
                dataSource
              })
            }
          />
        )}
        <div className={locals.resultContainer}>
          <Presenter
            {...props}
            isLoading={isLoading}
            hasErrors={hasErrors}
            hasItems={hasItems}
            {...cursorPaginationState}
          />
        </div>
      </div>
    </>
  );
}

UngroupedAnalyzeView.propTypes = {
  ...childrenArgsAsPropTypes,

  itemName: rpt.string.isRequired,
  withoutHeader: rpt.bool,
  getData: rpt.func.isRequired,
  getDetailData: rpt.func.isRequired,
  getId: rpt.func.isRequired,
  columnDefinitions: rpt.array.isRequired,
  DetailView: rpt.elementType.isRequired,
  CustomHeaderActions: rpt.elementType,
  sortOptions: optionsPropType,

  // Will be auto-provided by GroupedView in the relevant scenarios.
  groupLabel: rpt.string
};

export const detailViewProps = {
  ...childrenArgsAsPropTypes,
  getId: rpt.func.isRequired,
  itemName: rpt.string.isRequired,

  isLoading: rpt.bool,
  hasErrors: rpt.bool,
  hasItems: rpt.bool,

  items: rpt.array,
  errors: rpt.array,
  progress: rpt.object,
  canLoadMore: rpt.bool,
  loadMore: rpt.func,
  totalHits: rpt.number
};
