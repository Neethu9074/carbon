/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { t } from 'in-i18n';
import React from 'react';

import UngroupedView, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedView';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

import locals from './UngroupedViewTable.mless';

export { detailViewProps, retrievalSize } from 'in-new-components/AnalyzeView/UngroupedView';

export default function UngroupedAnalyzeViewTable(props) {
  return <UngroupedView {...props} Presenter={Table} />;
}

UngroupedAnalyzeViewTable.propTypes = {
  ...UngroupedView.propTypes
};

function Table(props) {
  const { groupLabel, orderBy, getHrefToUngroupedView, onOrderByChange, fields, ungroupedViewConfiguration } = props;

  const columnDefinitions = [
    ...props.columnDefinitions,
    ...fields
      .map(field => {
        // TODO We currently do not support rendering the individual metric values in the ungrouped view
        if (field.type === metricType) {
          return null;
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
    </>
  );
}
