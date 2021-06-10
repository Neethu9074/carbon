/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import UngroupedView, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedView';
import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { scrollToTop } from 'in-services/util/dom';
import { t } from 'in-i18n';

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
            getColumnFormatter,
            ColumnContent
          } = ungroupedViewConfiguration.metricFieldExtractors;
          const columnId = getColumnId({ metricDefinition });
          if (columnId == null || existingColumnIds.includes(columnId)) {
            // Avoid adding the same column twice, which could happen when the same metric with different aggregations is selected
            return null;
          }
          existingColumnIds.push(columnId);
          const columnLabel = getColumnLabel({ metricDefinition, tagCatalog: filteringTagCatalog });
          return {
            label: columnLabel,
            id: columnId,
            width: '9rem',
            widthInAbsoluteUnit: true,
            getContent(params) {
              if (ColumnContent != null) {
                return <ColumnContent {...params} />;
              }
              const value = getColumnValue({ metricDefinition, ...params });
              const formatter = getColumnFormatter({ metricDefinition });
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

  const [numberOfSkeletonRows, setNumberOfSkeletonRows] = useState(3);

  useEffect(() => {
    if (items?.length > 0) {
      setNumberOfSkeletonRows(items.length);
    }
  }, [items]);

  return (
    <>
      {items?.length > 0 ||
      (withEmbeddedLoadingIndicator && isLoading === true) ||
      (withEmbeddedNoDataIndicator && isLoading === false && items?.length === 0) ? (
        <CursorPaginatedTable
          {...props}
          columnDefinitions={columnDefinitions}
          numSkeletonRows={numberOfSkeletonRows}
          onChange={({ orderBy, orderDirection }) =>
            onOrderByChange({
              by: orderBy,
              direction: orderDirection
            })
          }
          fixedLayout
          orderBy={orderBy.by}
          orderDirection={orderBy.direction}
          filterByHref={groupLabel != null ? getHrefToUngroupedView(groupLabel) : null}
          filterByOnClick={groupLabel != null ? () => scrollToTop(window) : null}
          loadMoreLabel={t('in-components:analyze.loadMoreWithCount', { count: retrievalSize })}
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
