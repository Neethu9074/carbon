/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo, useState } from 'react';
import rpt from 'prop-types';

import { TAG, CONJUNCTION, joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS, IS_EMPTY, NOT_EMPTY, IS_BLANK } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { isFormModelValid as isFilterValid } from 'in-new-components/QueryBuilder/validation/formModel';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { metric as metricType, custom as customType } from 'in-new-components/AnalyzeView/fieldTypes';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { ua2OrderByChangedTracker, ua2OrderByGroupChangedTracker } from 'in-new-components/tracker';
import { isValid as isValidGrouping } from 'in-new-components/GroupingConfigurator/validation';
import { sanitizeTagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { NUMBER, KEY_VALUE_PAIR } from 'in-new-components/QueryBuilder/tagFilter/types';
import { columnDefinitionShape } from 'in-new-components/lists/List/ColumnizedContent';
import { UNSPECIFIED, NO_VALUE } from 'in-analyze/components/GroupedTraces/Group';
import { emptyArray, emptyObject, pendingResult } from 'in-services/fixedObjects';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { noResultObservable } from 'in-services/util/result';
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

const extendedColumnDefinitionShape = {
  ...columnDefinitionShape,
  label: rpt.string.isRequired
};

const fieldsPropTypes = rpt.arrayOf(
  rpt.shape({
    type: rpt.oneOf([metricType, customType]),

    // required for type=metric
    metricId: rpt.string,
    aggregationId: rpt.oneOf(Object.keys(aggregationLabels)),

    // required for type=custom. Must match the object keys within
    // customFieldRenderingInstructions
    customFieldId: rpt.string
  })
);

const chartedMetricsPropTypes = rpt.arrayOf(
  rpt.shape({
    metricId: rpt.string.isRequired,
    aggregationId: rpt.string.isRequired
  })
);

const groupedViewPropType = rpt.shape({
  defaultOrderBy: rpt.string.isRequired,
  defaultOrderDirection: rpt.oneOf(['ASC', 'DESC']).isRequired,
  getOrderById: rpt.func,
  customFieldRenderingInstructions: rpt.objectOf(rpt.shape(extendedColumnDefinitionShape).isRequired)
}).isRequired;

const ungroupedViewPropType = rpt.shape({
  defaultOrderBy: rpt.string.isRequired,
  defaultOrderDirection: rpt.oneOf(['ASC', 'DESC']).isRequired,
  getOrderById: rpt.func,

  // TODO: Technically this is not correct. The ungrouped view can be a list or a table.
  // The prop types are currently not accounting for this difference. However, they are
  // similar enough that we can live with the difference for now.
  customFieldRenderingInstructions: rpt.objectOf(rpt.shape(extendedColumnDefinitionShape).isRequired),
  metricFieldExtractors: rpt.shape({
    getColumnId: rpt.func.isRequired,
    getColumnLabel: rpt.func.isRequired,
    getColumnFormatter: rpt.func.isRequired,
    getColumnValue: rpt.func.isRequired
  })
}).isRequired;

const facetedSearchItemsPropType = rpt.arrayOf(
  rpt.shape({
    renderer: rpt.func,
    title: rpt.string,
    tag: rpt.string
  })
);

const metricCatalogFilterPropType = rpt.func;

TimeFixatingAnalyzeStateManagement.propTypes = {
  path: rpt.string.isRequired,
  dataSourceParameter: rpt.object.isRequired,
  defaultDataSource: rpt.string.isRequired,
  getTagCatalog: rpt.func.isRequired,

  dataSourceConfigurations: rpt.objectOf(
    rpt.shape({
      metricCatalogFilter: metricCatalogFilterPropType,
      facetedSearchItems: facetedSearchItemsPropType,
      groupedView: groupedViewPropType,
      ungroupedView: ungroupedViewPropType,
      fixedFields: fieldsPropTypes,
      defaultSelectableFields: fieldsPropTypes,
      defaultChartedMetrics: chartedMetricsPropTypes
    })
  ),

  children: rpt.func.isRequired
};

function AnalyzeStateManagement({
  refreshFixatedTimeConfig,
  defaultDataSource,
  getTagCatalog,
  getMetricCatalog,
  urlStateDefinition,
  dataSourceConfigurations,
  children
}) {
  const timeConfig = useTimeConfig();
  const [urlState, onChange, getChangeAsUrl] = useUrlState(urlStateDefinition);
  const dataSource = urlState.dataSource ?? defaultDataSource;
  const {
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields = emptyArray,
    defaultSelectableFields = emptyArray,
    defaultChartedMetrics = emptyArray,
    metricCatalogFilter
  } = dataSourceConfigurations[dataSource];

  const formModel = useStableObjectInstance(urlState.formModel);
  const onFormModelChange = formModel => onChange({ formModel });

  const groupBy = useStableObjectInstance(urlState.groupBy);
  const detailId = useStableObjectInstance(urlState.detailId);
  const selectableFields = useStableObjectInstance(urlState.fields ?? defaultSelectableFields);
  // charts should be shown, even if not explicitly selected
  const chartedMetrics = useStableObjectInstance(
    urlState.chartedMetrics?.length > 0 ? urlState.chartedMetrics : defaultChartedMetrics
  );

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

  const metricCatalogResult =
    useObservable(() => getMetricCatalog?.() || noResultObservable(), [getMetricCatalog]) ?? pendingResult;

  const isLoading =
    filteringTagCatalogResult.data == null || groupingTagCatalogResult.data == null || metricCatalogResult.data == null;
  const isValid = Boolean(
    !isLoading &&
      isFilterValid({
        tagCatalog: filteringTagCatalogResult.data,
        formModel
      }) &&
      isValidGrouping(groupBy, groupingTagCatalogResult.data)
  );

  const isGrouped = isNotBlank(groupBy?.groupbyTag);
  const { defaultOrderBy, defaultOrderDirection } = ungroupedView ?? emptyObject;
  const { defaultOrderBy: defaultOrderByGroups, defaultOrderDirection: defaultOrderDirectionGroups } =
    groupedView ?? emptyObject;

  const backendQueryModel = useMemo(() => (isValid ? toBackendQueryModel(formModel) : null), [isValid, formModel]);

  const orderBy = useStableObjectInstance({
    by: urlState.orderBy?.by ?? defaultOrderBy,
    direction: urlState.orderBy?.direction ?? defaultOrderDirection
  });

  const orderByGroups = useStableObjectInstance({
    by: urlState.orderByGroups?.by ?? defaultOrderByGroups,
    direction: urlState.orderByGroups?.direction ?? defaultOrderDirectionGroups
  });

  // Eventually we might wanna store this within the URL. This might become a lot more interesting when
  // our users can (de-)select their desired data series.
  const [chartableDataSeries, onChartableDataSeriesChange] = useState(null);

  const metricCatalog = metricCatalogResult.data;
  const onSelectableFieldsChange = selectableFields => {
    const changedParams = { fields: selectableFields };
    const fields = [...fixedFields, ...selectableFields];
    // reset "orderBy" if needed
    const availableOrderByIds = fields
      .map(field => ungroupedView.getOrderById && ungroupedView.getOrderById({ metricCatalog, field }))
      .filter(Boolean);
    if (!orderBy || !availableOrderByIds.includes(orderBy.by)) {
      changedParams.orderBy = {
        by: ungroupedView.defaultOrderBy,
        direction: ungroupedView.defaultOrderDirection
      };
    }
    // reset "orderByGroups" if needed
    const availableOrderByGroupIds = fields
      .map(field => groupedView.getOrderById && groupedView.getOrderById({ field }))
      .filter(Boolean);
    // Allow to sort by group name
    availableOrderByGroupIds.push('groupName');
    if (!orderByGroups || !availableOrderByGroupIds.includes(orderByGroups.by)) {
      changedParams.orderByGroups = {
        by: groupedView.defaultOrderBy,
        direction: groupedView.defaultOrderDirectionGroups
      };
    }
    onChange(changedParams);
  };

  return children({
    dataSource,
    isLoading,
    isValid,
    refreshFixatedTimeConfig,
    ungroupedViewConfiguration: ungroupedView,
    groupedViewConfiguration: groupedView,
    facetedSearchItems,
    fixedFields,
    metricCatalogFilter,

    backendQueryModel,
    formModel,
    onFormModelChange,
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
    getHrefToGroupedView(groupValue) {
      return getChangeAsUrl({
        groupBy: {
          groupbyTag: groupValue
        }
      });
    },
    groupingTagCatalog: groupingTagCatalogResult.data,

    getHrefWithAdditionalTagFilter(newTagFilter) {
      const changedFormModel = formModel.slice();
      if (changedFormModel.length > 0) {
        changedFormModel.push({
          type: CONJUNCTION,
          logicalOperator: and
        });
      }
      changedFormModel.push(newTagFilter);
      return getChangeAsUrl({
        formModel: changedFormModel
      });
    },

    getHrefWithTagFilterExpression(newTagExpression) {
      return getChangeAsUrl({
        formModel: newTagExpression
      });
    },

    orderBy,
    onOrderByChange: orderBy => {
      ua2OrderByChangedTracker({ dataSource, ...orderBy });
      onChange({ orderBy });
    },
    orderByGroups,
    onOrderByGroupsChange: orderByGroups => {
      ua2OrderByGroupChangedTracker({ dataSource, ...orderByGroups });
      onChange({ orderByGroups });
    },
    selectableFields,
    onSelectableFieldsChange,

    metricCatalog: metricCatalogResult.data,
    chartableDataSeries,
    onChartableDataSeriesChange,
    chartedMetrics,
    onChartedMetricsChange: chartedMetrics => onChange({ chartedMetrics }),

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
      formModel: addGroupingCriteriaToFormModel(groupBy, groupValue, formModel, groupingTagCatalogResult.data)
    };
  }
}

export const childrenArgsAsPropTypes = {
  isLoading: rpt.bool.isRequired,
  dataSource: rpt.string.isRequired,
  refreshFixatedTimeConfig: rpt.func.isRequired,
  isValid: rpt.bool.isRequired,
  groupedViewConfiguration: groupedViewPropType,
  ungroupedViewConfiguration: ungroupedViewPropType,

  backendQueryModel: rpt.object,
  formModel: rpt.array.isRequired,
  onFormModelChange: rpt.func.isRequired,
  filteringTagCatalog: rpt.object,
  getHrefWithAdditionalTagFilter: rpt.func.isRequired,
  getHrefWithTagFilterExpression: rpt.func.isRequired,

  isGrouped: rpt.bool.isRequired,
  groupBy: rpt.shape({
    groupbyTag: rpt.string,
    groupbyTagSecondLevelKey: rpt.string
  }),
  onGroupByChange: rpt.func.isRequired,
  getHrefToUngroupedView: rpt.func.isRequired,
  getHrefToGroupedView: rpt.func.isRequired,
  groupingTagCatalog: rpt.object,

  orderBy: rpt.shape({
    by: rpt.string.isRequired,
    direction: rpt.oneOf(['ASC', 'DESC']).isRequired
  }).isRequired,
  onOrderByChange: rpt.func.isRequired,

  facetedSearchItems: facetedSearchItemsPropType,

  fixedFields: fieldsPropTypes,
  selectableFields: fieldsPropTypes,
  onSelectableFieldsChange: rpt.func.isRequired,
  metricCatalogFilter: metricCatalogFilterPropType,
  metricCatalog: rpt.arrayOf(
    rpt.shape({
      metricId: rpt.string,
      label: rpt.string,
      formatter: rpt.string,
      description: rpt.string,
      aggregations: rpt.arrayOf(rpt.string)
    })
  ),
  // If grouping is selected there is a difference between setting 'chartableDataSeries' to 'null' vs '[]'. The
  // former means that the 'chartableDataSeries' are not known yet, e.g., the query which will determine
  // the 'chartableDataSeries' is being executed, whereas the latter means that there is no 'chartableDataSeries'
  // to be displayed.
  chartableDataSeries: rpt.arrayOf(
    rpt.shape({
      label: rpt.string.isRequired,
      formModel: rpt.array.isRequired
    })
  ),
  onChartableDataSeriesChange: rpt.func.isRequired,
  chartedMetrics: rpt.arrayOf(
    rpt.shape({
      metricId: rpt.string.isRequired,
      aggregationId: rpt.string.isRequired
    })
  ),
  onChartedMetricsChange: rpt.func.isRequired,

  detailId: rpt.any,
  getHrefToDetailId: rpt.func.isRequired,
  // Usage strongly discouraged! Please use getHrefToDetailId unless you do not have synchronous
  // access to the detail ID!
  setDetailId: rpt.func.isRequired
};

export function addGroupingCriteriaToFormModel(groupBy, groupValue, formModel, groupingTagCatalog) {
  const groupByTagType = groupingTagCatalog?.tags.find(tag => tag.name === groupBy.groupbyTag)?.type;

  let newTagFilter;
  if (groupValue === UNSPECIFIED) {
    newTagFilter = {
      type: TAG,
      operator: IS_EMPTY,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      entity: groupBy.groupbyTagEntity
    };
  } else if (groupValue === NO_VALUE) {
    newTagFilter = {
      type: TAG,
      operator: IS_BLANK,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      entity: groupBy.groupbyTagEntity
    };
  } else if (groupByTagType === KEY_VALUE_PAIR && !groupBy.groupbyTagSecondLevelKey) {
    newTagFilter = {
      type: TAG,
      operator: NOT_EMPTY,
      name: groupBy.groupbyTag,
      key: groupValue,
      entity: groupBy.groupbyTagEntity
    };
  } else {
    newTagFilter = {
      type: TAG,
      operator: EQUALS,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      value: groupByTagType === NUMBER ? Number(groupValue) : groupValue,
      entity: groupBy.groupbyTagEntity
    };
  }
  return joinExpressions({ expressions: [formModel, sanitizeTagFilter(newTagFilter)] });
}
