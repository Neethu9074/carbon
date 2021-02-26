/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { t } from 'in-i18n';
import React from 'react';

import UngroupedView, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedView';
import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { wrapToDiscardNegativeValues } from 'in-analyze/metricDefinitionHelpers';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getFormatter } from 'in-services/formatters/backendFormatter';

import locals from './UngroupedViewTable.mless';

export { detailViewProps, retrievalSize } from 'in-new-components/AnalyzeView/UngroupedView';

export default function UngroupedAnalyzeViewTable(props) {
  return <UngroupedView {...props} Presenter={Table} />;
}

UngroupedAnalyzeViewTable.propTypes = {
  ...UngroupedView.propTypes
};

function Table(props) {
  const {
    groupLabel,
    orderBy,
    getHrefToUngroupedView,
    onOrderByChange,
    selectableFields,
    fixedFields,
    ungroupedViewConfiguration,
    metricCatalog,
    filteringTagCatalog,
    progress,
    errors,
    items,
    isLoading,
    withEmbeddedLoadingIndicator = false,
    withEmbeddedNoDataIndicator = false
  } = props;
  const fields = [...fixedFields, ...selectableFields];

  const existingColumnIds = [];
  const columnDefinitions = [
    ...props.columnDefinitions,
    ...fields
      .map(field => {
        if (field.type === metricType) {
          const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
          if (metricDefinition == null || ungroupedViewConfiguration.metricFieldExtractors == null) {
            // Ignore unknown metrics or if we don't know how to extract the respective values
            return null;
          }
          const {
            getColumnId,
            getColumnValue,
            getColumnLabel,
            getColumnFormatter
          } = ungroupedViewConfiguration.metricFieldExtractors;
          const columnId = getColumnId({ metricDefinition });
          if (columnId == null || existingColumnIds.includes(columnId)) {
            // Avoid adding the same column twice, which could happen when the same metric with different aggregations is selected
            return null;
          }
          existingColumnIds.push(columnId);
          const columnLabel = getColumnLabel({ metricDefinition, tagCatalog: filteringTagCatalog });
          const columnFormatter = getColumnFormatter({ metricDefinition });
          return {
            label: columnLabel,
            id: columnId,
            width: '9rem',
            minWidth: '6rem',
            shrink: true,
            getContent(params) {
              const value = getColumnValue({ metricDefinition, ...params });
              const formatter = wrapToDiscardNegativeValues(getFormatter(columnFormatter)).compact;
              return <span>{formatter?.(value) ?? value}</span>;
            }
          };
        }

        return {
          ...ungroupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId],
          id: field.customFieldId
        };
      })
      // We may not have a representation for all fields in the ungrouped view
      .filter(Boolean)
  ];

  return (
    <>
      {items?.length > 0 ||
      (withEmbeddedLoadingIndicator && isLoading === true) ||
      (withEmbeddedNoDataIndicator && isLoading === false && items?.length === 0) ? (
        <CursorPaginatedTable
          {...props}
          columnDefinitions={columnDefinitions}
          numSkeletonRows={3}
          onChange={({ orderBy, orderDirection }) =>
            onOrderByChange({
              by: orderBy,
              direction: orderDirection
            })
          }
          fixedLayout
          orderBy={orderBy.by}
          orderDirection={orderBy.direction}
          filterByHref={groupLabel ? getHrefToUngroupedView(groupLabel) : null}
          loadMoreLabel={t('in-new-components:analyze.loadMore', { count: retrievalSize })}
          renderNoDataAvailable={noDataMessage => (
            <NoDataAvailable className={locals.noData} text={noDataMessage} height={80} />
          )}
        />
      ) : (
        <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={errors} items={items} />
      )}
    </>
  );
}
