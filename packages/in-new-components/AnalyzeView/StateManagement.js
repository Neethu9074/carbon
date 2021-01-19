/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';
import rpt from 'prop-types';

import { isFormModelValid as isFilterValid } from 'in-new-components/QueryBuilder/validation/formModel';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { isValid as isValidGrouping } from 'in-new-components/GroupingConfigurator/validation';
import { TAG, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';
import { NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import useStableObjectIntance from 'in-hooks/useStableObjectIntance';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { aggregationLabels } from 'in-stores/metric/metric';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';

export default function TimeFixatingAnalyzeStateManagement(props) {
  const parameters = useMemo(
    () => ({
      ...createParameters(props.path),
      dataSource: {
        ...props.dataSourceParameter,
        as: 'dataSource'
      }
    }),
    [props.path, props.dataSourceParameter]
  );

  // The URL state definition is static. We have to memo it here to avoid
  // change detection triggers in useUrlState.
  const urlStateDefinition = useMemo(
    () => ({
      bind: Object.values(parameters),
      replaceHistory: false
    }),
    [parameters]
  );

  // Ensure that we only ever receive the tag catalog once (per time config).
  const getTagCatalog = useMemo(() => getTagCatalogOnce(props.getTagCatalog), [props.getTagCatalog]);

  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => (
        <AnalyzeStateManagement
          {...props}
          urlStateDefinition={urlStateDefinition}
          getTagCatalog={getTagCatalog}
          refreshFixatedTimeConfig={refresh}
        />
      )}
    </FixatedTimeConfigContextModification>
  );
}

TimeFixatingAnalyzeStateManagement.propTypes = {
  path: rpt.string.isRequired,
  dataSourceParameter: rpt.object.isRequired,
  defaultDataSource: rpt.string.isRequired,
  getTagCatalog: rpt.func.isRequired,
  groupedView: rpt.shape({
    defaultOrderBy: rpt.string.isRequired,
    defaultOrderDirection: rpt.oneOf(['ASC', 'DESC']).isRequired
  }).isRequired,
  ungroupedView: rpt.shape({
    defaultOrderBy: rpt.string.isRequired,
    defaultOrderDirection: rpt.oneOf(['ASC', 'DESC']).isRequired
  }).isRequired,
  children: rpt.func.isRequired
};

function AnalyzeStateManagement({
  refreshFixatedTimeConfig,
  defaultDataSource,
  getTagCatalog,
  groupedView,
  ungroupedView,
  urlStateDefinition,
  children
}) {
  const timeConfig = useTimeConfig();
  const [urlState, onChange, getChangeAsUrl] = useUrlState(urlStateDefinition);

  const tagFilterExpression = useStableObjectIntance(urlState.tagFilterExpression);
  const groupBy = useStableObjectIntance(urlState.groupBy);
  const detailId = useStableObjectIntance(urlState.detailId);
  const metrics = useStableObjectIntance(urlState.metrics);
  const dataSource = urlState.dataSource ?? defaultDataSource;

  const filteringTagCatalogResult =
    useObservable(
      () =>
        getTagCatalog({
          timeConfig,
          dataSource,
          useCase: 'FILTERING'
        }),
      [getTagCatalog, timeConfig, dataSource]
    ) ?? pendingResult;

  const groupingTagCatalogResult =
    useObservable(
      () =>
        getTagCatalog({
          timeConfig,
          dataSource,
          useCase: 'GROUPING'
        }),
      [getTagCatalog, timeConfig, dataSource]
    ) ?? pendingResult;

  const isLoading = filteringTagCatalogResult.data == null || groupingTagCatalogResult.data == null;
  const isValid =
    !isLoading &&
    isFilterValid({
      tagCatalog: filteringTagCatalogResult.data,
      formModel: tagFilterExpression
    }) &&
    isValidGrouping(groupBy, groupingTagCatalogResult.data);

  const isGrouped = isNotBlank(groupBy?.groupbyTag);
  const activeListViewConfiguration = isGrouped ? groupedView : ungroupedView;
  const { defaultOrderBy, defaultOrderDirection } = activeListViewConfiguration;

  const backendQueryModel = useMemo(() => (isValid ? toBackendQueryModel(tagFilterExpression) : null), [
    isValid,
    tagFilterExpression
  ]);

  const orderBy = useStableObjectIntance({
    by: urlState.orderBy?.by ?? defaultOrderBy,
    direction: urlState.orderBy?.direction ?? defaultOrderDirection
  });

  return children({
    dataSource,
    isLoading,
    isValid,
    refreshFixatedTimeConfig,

    backendQueryModel,
    tagFilterExpression,
    onTagFilterExpressionChange: tagFilterExpression => onChange({ tagFilterExpression }),
    filteringTagCatalog: filteringTagCatalogResult.data,

    isGrouped,
    groupBy,
    onGroupByChange: groupBy => onChange({ groupBy }),
    getHrefToUngroupedView(groupValue) {
      return getChangeAsUrl({
        ...(groupValue != null ? getStateChangeForUngroupedView(groupValue) : emptyObject),
        detailId: null
      });
    },

    getHrefWithTagExpression(newTagFilter) {
      const changedTagFilterExpression = tagFilterExpression.slice();
      if (changedTagFilterExpression.length > 0) {
        changedTagFilterExpression.push({
          type: CONJUNCTION,
          logicalOperator: and
        });
      }
      changedTagFilterExpression.push(newTagFilter);
      return getChangeAsUrl({
        tagFilterExpression: changedTagFilterExpression
      });
    },

    groupingTagCatalog: groupingTagCatalogResult.data,

    orderBy,
    onOrderByChange: orderBy => onChange({ orderBy }),

    metrics,
    onMetricsChange: metrics => onChange({ metrics }),

    detailId,
    getHrefToDetailId: (detailId, groupValue) => {
      return getChangeAsUrl({
        ...(groupValue != null ? getStateChangeForUngroupedView(groupValue) : emptyObject),
        detailId
      });
    },
    setDetailId: detailId => onChange({ detailId })
  });

  function getStateChangeForUngroupedView(groupValue) {
    return {
      groupBy: emptyObject,
      tagFilterExpression: addGroupingCriteriaToTagFilterExpression(groupBy, groupValue, tagFilterExpression)
    };
  }
}

export const childrenArgsAsPropTypes = {
  isLoading: rpt.bool.isRequired,
  dataSource: rpt.string.isRequired,
  refreshFixatedTimeConfig: rpt.func.isRequired,
  isValid: rpt.bool.isRequired,

  backendQueryModel: rpt.object,
  tagFilterExpression: rpt.array.isRequired,
  onTagFilterExpressionChange: rpt.func.isRequired,

  isGrouped: rpt.bool.isRequired,
  groupBy: rpt.shape({
    groupbyTag: rpt.string,
    groupbyTagSecondLevelKey: rpt.string
  }),
  onGroupByChange: rpt.func.isRequired,
  getHrefToUngroupedView: rpt.func.isRequired,

  orderBy: rpt.shape({
    by: rpt.string.isRequired,
    direction: rpt.oneOf(['ASC', 'DESC']).isRequired
  }).isRequired,
  onOrderByChange: rpt.func,

  metrics: rpt.arrayOf(
    rpt.shape({
      metric: rpt.string.isRequired,
      aggregation: rpt.oneOf(Object.keys(aggregationLabels)).isRequired
    })
  ).isRequired,
  onMetricsChange: rpt.func.isRequired,

  detailId: rpt.any,
  getHrefToDetailId: rpt.func.isRequired,
  // Usage strongly discouraged! Please use getHrefToDetailId unless you do not have synchronous
  // access to the detail ID!
  setDetailId: rpt.func.isRequired
};

export function addGroupingCriteriaToTagFilterExpression(groupBy, groupValue, tagFilterExpression) {
  const newTagFilter = {
    type: TAG,
    name: groupBy.groupbyTag,
    key: groupBy.groupbyTagSecondLevelKey,
    value: groupValue,
    operator: EQUALS,
    entity: groupBy.groupbyTagEntity ?? NOT_APPLICABLE
  };

  const changedTagFilterExpression = tagFilterExpression.slice();
  if (changedTagFilterExpression.length > 0) {
    changedTagFilterExpression.push({
      type: CONJUNCTION,
      logicalOperator: and
    });
  }
  changedTagFilterExpression.push(newTagFilter);
  return changedTagFilterExpression;
}
