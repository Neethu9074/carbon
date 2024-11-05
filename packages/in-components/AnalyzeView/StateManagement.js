/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import pickBy from 'lodash/pickBy';
import rpt from 'prop-types';

import { useObservable } from '@instana/hooks';

import { EQUALS, IS_BLANK, IS_EMPTY, NOT_EMPTY, STARTS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import { BOOLEAN, KEY_NUMBER_PAIR, KEY_VALUE_PAIR, NUMBER } from 'in-components/QueryBuilder/tagFilter/types';
import { CONJUNCTION, joinExpressions, TAG } from 'in-components/QueryBuilder/transformation/formModel';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { removeFacetTag, tagFiltersFromFacets } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { useCustomMetricSuggestions } from 'in-applications/hooks/useCustomMetricSuggestions';
import { isValid as isValidGrouping } from 'in-components/GroupingConfigurator/validation';
import { sanitizeTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import { NO_VALUE, UNSPECIFIED } from 'in-analyze/components/GroupedTraces/Group';
import { emptyArray, emptyObject, pendingResult } from 'in-services/fixedObjects';
import { getSingleNumberMetricId } from 'in-components/AnalyzeView/metrics';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { noResultObservable } from 'in-services/util/result';
import { aggregationLabels } from 'in-stores/metric/metric';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

// The maximum allowed label size for a group is 256.
const MAX_GROUP_BY_LABEL_LENGTH = 256;

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
  const { trackUa2FacetsChanged, trackUa2FormModelChanged } = useApplicationTracker();
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => (
        <AnalyzeStateManagement
          {...props}
          urlStateDefinition={urlStateDefinition}
          getTagCatalog={getTagCatalog}
          refreshFixatedTimeConfig={refresh}
          trackUa2FacetsChanged={trackUa2FacetsChanged}
          trackUa2FormModelChanged={trackUa2FormModelChanged}
        />
      )}
    </FixatedTimeConfigContextModification>
  );
}

const extendedColumnDefinitionShape = {
  width: rpt.string,
  minWidth: rpt.string,
  getContent: rpt.func.isRequired,
  verticallyCenter: rpt.bool,
  forceMinimumWidth: rpt.bool,
  shrink: rpt.bool,
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
  rpt.oneOfType([
    rpt.shape({
      metricId: rpt.string.isRequired,
      aggregationId: rpt.string.isRequired
    }),
    rpt.shape({
      templateId: rpt.string.isRequired
    })
  ])
);

const groupedViewPropType = rpt.shape({
  defaultOrderBy: rpt.string.isRequired,
  defaultOrderDirection: rpt.oneOf(['ASC', 'DESC']).isRequired,
  timestampName: rpt.string,
  orderByGroupName: rpt.string,
  customFieldRenderingInstructions: rpt.objectOf(rpt.shape(extendedColumnDefinitionShape).isRequired),
  getCustomGroupLabel: rpt.func
}).isRequired;

const ungroupedViewPropType = rpt.shape({
  defaultOrderBy: rpt.string.isRequired,
  defaultOrderDirection: rpt.oneOf(['ASC', 'DESC']).isRequired,
  timestampName: rpt.string,

  // TODO: Technically this is not correct. The ungrouped view can be a list or a table.
  // The prop types are currently not accounting for this difference. However, they are
  // similar enough that we can live with the difference for now.
  customFieldRenderingInstructions: rpt.objectOf(rpt.shape(extendedColumnDefinitionShape).isRequired),
  metricFieldExtractors: rpt.shape({
    getColumnId: rpt.func.isRequired,
    getColumnLabel: rpt.func.isRequired,
    // For simple value rendring specify 'getColumnFormatter' and 'getColumnValue', for advanced
    // rendering specify 'ColumnContent' instead.
    getColumnFormatter: rpt.func,
    getColumnValue: rpt.func,
    ColumnContent: rpt.elementType
  })
}).isRequired;

const facetedSearchItemsPropType = rpt.arrayOf(
  rpt.shape({
    renderer: rpt.func,
    title: rpt.string,
    tag: rpt.string,
    enableUseAsGroup: rpt.bool,
    customLabelMapper: rpt.func,
    ranges: rpt.arrayOf(
      rpt.shape({
        start: rpt.number,
        end: rpt.number
      })
    ),
    key: rpt.string,
    getItems: rpt.func,
    getSuggestionName: rpt.func,
    extraProps: rpt.object
  })
);

const metricCatalogTransformerPropType = rpt.func;

TimeFixatingAnalyzeStateManagement.propTypes = {
  path: rpt.string.isRequired,
  dataSourceParameter: rpt.object.isRequired,
  defaultDataSource: rpt.string.isRequired,
  getTagCatalog: rpt.func.isRequired,

  dataSourceConfigurations: rpt.objectOf(
    rpt.shape({
      metricCatalogTransformer: metricCatalogTransformerPropType,
      chartableMetricCatalogTransformer: metricCatalogTransformerPropType,
      facetedSearchItems: facetedSearchItemsPropType,
      groupedView: groupedViewPropType,
      ungroupedView: ungroupedViewPropType,
      fixedFields: fieldsPropTypes,
      defaultSelectableFields: fieldsPropTypes,
      defaultChartedMetrics: chartedMetricsPropTypes,
      getCustomFormatter: rpt.func
    })
  ),

  children: rpt.func.isRequired
};

function AnalyzeStateManagement({
  refreshFixatedTimeConfig,
  defaultDataSource,
  getTagCatalog,
  getMetricCatalog,
  getMetricTemplates,
  urlStateDefinition,
  dataSourceConfigurations,
  getCustomGroupingTagFilter,
  children,
  trackUa2FacetsChanged,
  trackUa2FormModelChanged
}) {
  const timeConfig = useTimeConfig();
  const [urlState, onChange, getChangeAsUrl] = useUrlState(urlStateDefinition);
  const dataSource = urlState.dataSource ?? defaultDataSource;
  const {
    facetedSearchItems,
    groupedView,
    ungroupedView,
    getCustomMetricUiFormatterName,
    fixedFields = emptyArray,
    defaultSelectableFields = emptyArray,
    defaultChartedMetrics = emptyArray,
    metricCatalogTransformer,
    chartableMetricCatalogTransformer,
    supportedCustomMetrics
  } = dataSourceConfigurations[dataSource];

  const { trackUa2OrderByChanged, trackUa2OrderByGroupChanged } = useAnalyzeTracker();
  const formModel = useStableObjectInstance(urlState.formModel);
  const onFormModelChange = formModel => {
    trackUa2FormModelChanged({
      formModel,
      url: getChangeAsUrl({ formModel }),
      tagName: formModel?.filter(form => form.name).map(form => form.name),
      operator: formModel?.filter(form => form.operator).map(form => form.operator)
    });
    onChange({ formModel });
  };
  const facets = useStableObjectInstance(urlState.facets);

  const resetFacets = tag => {
    if (tag != null) {
      return getChangeAsUrl({ facets: removeFacetTag(facets, tag) });
    } else {
      return getChangeAsUrl({ facets: {} });
    }
  };

  const onFacetedSearchChange = facets => {
    trackUa2FacetsChanged({ facets, url: getChangeAsUrl({ facets }) });
    onChange({ facets });
  };

  const getUpdatedFacetedSearchHref = facets => {
    return getChangeAsUrl({
      facets
    });
  };

  const facetsAsTagFilterExpression = useMemo(
    () => tagFiltersFromFacets(facetedSearchItems, facets),
    [facetedSearchItems, facets]
  );

  const groupBy = useStableObjectInstance(urlState.groupBy);
  const detailId = useStableObjectInstance(urlState.detailId);
  const selectedId = useStableObjectInstance(urlState.selectedId);
  const selectedGroup = useStableObjectInstance(urlState.selectedGroup);
  const initialLogLines = useStableObjectInstance(urlState.initialLogLines);
  const selectableFields = useStableObjectInstance(urlState.fields ?? defaultSelectableFields);
  // charts should be shown, even if not explicitly selected
  const chartedMetricData = useStableObjectInstance(
    urlState.chartedMetrics ? urlState.chartedMetrics : defaultChartedMetrics
  );

  const groupedPaginationRef = useRef({});

  const metricTemplatesResult =
    useObservable(() => getMetricTemplates() || noResultObservable(), [getMetricTemplates]) ?? pendingResult;

  const customMetricSuggestionsResult = useCustomMetricSuggestions(supportedCustomMetrics, timeConfig, formModel);
  const customMetricSuggestions = useMemo(
    () => customMetricSuggestionsResult?.data,
    [customMetricSuggestionsResult?.data]
  );

  const chartedMetricsTemplates = useMemo(() => {
    if (metricTemplatesResult?.progress.loading) {
      return;
    }

    if (metricTemplatesResult?.errors.length > 0) {
      return;
    }

    if (chartableMetricCatalogTransformer != null) {
      return metricTemplatesResult?.data.map(template => {
        return {
          ...template,
          metrics: template.metrics.map(chartableMetricCatalogTransformer).filter(Boolean)
        };
      });
    }

    return metricTemplatesResult?.data;
  }, [metricTemplatesResult, chartableMetricCatalogTransformer]);
  const currentMetricsTemplate = chartedMetricData?.find(metricData => metricData.templateId != null);

  let chartedMetricsTemplate;
  let chartedMetrics;
  if (currentMetricsTemplate) {
    chartedMetricsTemplate = chartedMetricsTemplates?.find(
      template => template.templateId === currentMetricsTemplate.templateId
    );
    chartedMetrics = currentMetricsTemplate?.metrics;
  } else {
    chartedMetrics = chartedMetricData;
  }

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

  const metricCatalog = useMemo(() => {
    let catalog = metricCatalogResult?.data;
    if (metricCatalogTransformer != null) {
      return catalog?.map(metricCatalogTransformer).filter(Boolean);
    }
    return catalog;
  }, [metricCatalogResult, metricCatalogTransformer]);

  const chartableMetricCatalog = useMemo(() => {
    if (chartableMetricCatalogTransformer != null) {
      const catalog = metricCatalogResult?.data?.map(chartableMetricCatalogTransformer).filter(Boolean);
      if (catalog && customMetricSuggestions) {
        addCustomMetricProps(customMetricSuggestions, catalog, chartedMetrics);
      }
      return catalog;
    }
    return metricCatalog;
  }, [
    chartableMetricCatalogTransformer,
    chartedMetrics,
    metricCatalog,
    metricCatalogResult?.data,
    customMetricSuggestions
  ]);

  const backendQueryModel = useMemo(() => {
    return toBackendQueryModel(formModel);
  }, [formModel]);

  const formModelWithFacets = useMemo(
    () => joinExpressions({ expressions: [formModel, facetsAsTagFilterExpression] }),
    [formModel, facetsAsTagFilterExpression]
  );
  const backendQueryModelWithFacets = useMemo(() => toBackendQueryModel(formModelWithFacets), [formModelWithFacets]);

  const isLoading =
    filteringTagCatalogResult.data == null || groupingTagCatalogResult.data == null || metricCatalogResult.data == null;
  const isValid = Boolean(
    !isLoading &&
      validateFormModel({
        tagCatalog: filteringTagCatalogResult.data,
        formModel: formModelWithFacets
      }).isValid &&
      isValidGrouping(groupBy, groupingTagCatalogResult.data)
  );

  const isGrouped = isNotBlank(groupBy?.groupbyTag);
  const { defaultOrderBy, defaultOrderDirection } = ungroupedView ?? emptyObject;
  const { defaultOrderBy: defaultOrderByGroups, defaultOrderDirection: defaultOrderDirectionGroups } =
    groupedView ?? emptyObject;

  const orderBy = useStableObjectInstance({
    by: urlState.orderBy?.by ?? defaultOrderBy,
    direction: urlState.orderBy?.direction ?? defaultOrderDirection
  });

  const orderByGroups = useStableObjectInstance({
    by: urlState.orderByGroups?.by ?? defaultOrderByGroups,
    direction: urlState.orderByGroups?.direction ?? defaultOrderDirectionGroups
  });

  const timestampName = dataSourceConfigurations[dataSource].groupedView.timestampName;
  const getOrderByGroupId = useCallback(
    ({ field }) => {
      if (field.type === customType) {
        if (field.customFieldId === 'timestamp') {
          return timestampName ?? 'earliestTimestamp';
        }
        return field.customFieldId;
      }
      if (field.type === metricType) {
        return getSingleNumberMetricId(field);
      }
      return null;
    },
    [timestampName]
  );

  // Eventually we might wanna store this within the URL. This might become a lot more interesting when
  // our users can (de-)select their desired data series.
  const [chartableDataSeries, onChartableDataSeriesChange] = useState(null);
  const onSelectableFieldsChange = selectableFields => {
    const changedParams = { fields: selectableFields };
    const fields = [...fixedFields, ...selectableFields];
    // reset "orderBy" if needed
    const availableOrderByIds = fields.map(field => getOrderById({ metricCatalog, field })).filter(Boolean);
    if (!orderBy || !availableOrderByIds.includes(orderBy.by)) {
      changedParams.orderBy = {
        by: ungroupedView.defaultOrderBy,
        direction: ungroupedView.defaultOrderDirection
      };
    }
    // reset "orderByGroups" if needed
    const availableOrderByGroupIds = fields.map(field => getOrderByGroupId({ field })).filter(Boolean);
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
    setUrlState: onChange,
    dataSource,
    isLoading,
    isValid,
    refreshFixatedTimeConfig,
    ungroupedViewConfiguration: ungroupedView,
    groupedViewConfiguration: groupedView,
    getCustomMetricUiFormatterName,
    getOrderByGroupId,
    facetedSearchItems,
    fixedFields,
    backendQueryModel,
    backendQueryModelWithFacets,
    formModel,
    formModelWithFacets,
    onFormModelChange,
    facets,
    facetsAsTagFilterExpression,
    onFacetedSearchSelectionChange: onFacetedSearchChange,
    resetFacets,
    getUpdatedFacetedSearchHref,
    filteringTagCatalog: filteringTagCatalogResult.data,
    isGrouped,
    groupBy,
    selectedGroup,
    onGroupByChange: groupBy => onChange({ groupBy: pickBy(groupBy, val => !!val) }),
    getHrefToUngroupedView(groupValue) {
      return getChangeAsUrl({
        ...(groupValue != null ? getStateChangeForUngroupedView(groupValue) : { groupBy: emptyObject }),
        detailId: null
      });
    },
    getHrefToGroupedView({ tag, tagEntity, secondLevelKey }) {
      return getChangeAsUrl({
        groupBy: {
          groupbyTag: tag,
          groupbyTagSecondLevelKey: secondLevelKey,
          ...(tagEntity && { groupbyTagEntity: tagEntity })
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
      trackUa2OrderByChanged({ dataSource, ...orderBy });
      onChange({ orderBy });
    },
    orderByGroups,
    onOrderByGroupsChange: orderByGroups => {
      trackUa2OrderByGroupChanged({ dataSource, ...orderByGroups });
      onChange({ orderByGroups });
    },
    selectableFields,
    onSelectableFieldsChange,

    metricCatalog,
    chartableMetricCatalog,
    chartableDataSeries,
    onChartableDataSeriesChange,
    chartedMetrics,
    chartedMetricsTemplate,
    chartedMetricsTemplates,
    onChartedMetricsChange: chartedMetrics => onChange({ chartedMetrics }),

    detailId,
    selectedId,
    initialLogLines,
    getHrefToDetailId: (detailId, groupValue) => {
      return getChangeAsUrl({
        ...(groupValue != null ? getStateChangeForUngroupedView(groupValue) : emptyObject),
        detailId
      });
    },
    setDetailId: detailId => onChange({ detailId }),
    setSelectedId: selectedId => onChange({ selectedId }),
    groupedPaginationRef
  });

  function getStateChangeForUngroupedView(groupValue) {
    return {
      groupBy: emptyObject,
      formModel: addGroupingCriteriaToFormModel(
        groupBy,
        groupValue,
        formModel,
        groupingTagCatalogResult.data,
        getCustomGroupingTagFilter
      )
    };
  }
}

function addCustomMetricProps(customMetricSuggestions, catalog, chartedMetrics) {
  customMetricSuggestions.forEach(({ metricId, suggestions }) => {
    const customMetricDefinition = catalog?.find(metric => metric.metricId === metricId);
    if (customMetricDefinition) {
      const metricTagSuggestions = suggestions.map(suggestion => ({ label: suggestion, value: suggestion }));
      catalog.find(metric => metric.metricId === metricId).metricTagSuggestions = metricTagSuggestions;
      catalog.find(metric => metric.metricId === metricId).secondLevelMetricId =
        chartedMetrics?.[0]?.secondLevelMetricId;
    }
  });
}

function getOrderById({ metricCatalog, field }) {
  if (field.type === customType) {
    return field.customFieldId;
  }
  if (field.type === metricType) {
    const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
    return metricDefinition?.tagName;
  }
  return null;
}

const metricCatalogPropType = rpt.arrayOf(
  rpt.shape({
    metricId: rpt.string,
    label: rpt.string,
    formatter: rpt.string,
    description: rpt.string,
    aggregations: rpt.arrayOf(rpt.string)
  })
);

export const childrenArgsAsPropTypes = {
  isLoading: rpt.bool.isRequired,
  dataSource: rpt.string.isRequired,
  refreshFixatedTimeConfig: rpt.func.isRequired,
  isValid: rpt.bool.isRequired,
  groupedViewConfiguration: groupedViewPropType,
  ungroupedViewConfiguration: ungroupedViewPropType,
  getCustomMetricUiFormatterName: rpt.func,
  getOrderByGroupId: rpt.func.isRequired,

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
  getCustomGroupingTagFilter: rpt.func,
  updateTest: rpt.func,
  orderBy: rpt.shape({
    by: rpt.string.isRequired,
    direction: rpt.oneOf(['ASC', 'DESC']).isRequired
  }).isRequired,
  onOrderByChange: rpt.func.isRequired,

  facetedSearchItems: facetedSearchItemsPropType,

  fixedFields: fieldsPropTypes,
  selectableFields: fieldsPropTypes,
  onSelectableFieldsChange: rpt.func.isRequired,
  metricCatalog: metricCatalogPropType,
  chartableMetricCatalog: metricCatalogPropType,
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

export function addGroupingCriteriaToFormModel(
  groupBy,
  groupValue,
  formModel,
  groupingTagCatalog,
  getCustomGroupingTagFilter
) {
  const customGroupingTagFilter = getCustomGroupingTagFilter ? getCustomGroupingTagFilter(groupBy, groupValue) : null;
  if (customGroupingTagFilter) {
    return joinExpressions({ expressions: [formModel, sanitizeTagFilter(customGroupingTagFilter)] });
  }
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
  } else if (
    (groupByTagType === KEY_VALUE_PAIR || groupByTagType === KEY_NUMBER_PAIR) &&
    !groupBy.groupbyTagSecondLevelKey
  ) {
    newTagFilter = {
      type: TAG,
      operator: NOT_EMPTY,
      name: groupBy.groupbyTag,
      key: groupValue,
      entity: groupBy.groupbyTagEntity
    };
  } else {
    let value;
    if (groupByTagType === NUMBER || groupByTagType === KEY_NUMBER_PAIR) {
      value = Number(groupValue);
    } else if (groupByTagType === BOOLEAN) {
      value = groupValue === 'true';
    } else {
      value = groupValue;
    }
    newTagFilter = {
      type: TAG,
      // If the label has this size, we don't know, if it was truncated or not, so we have to assume it was.
      operator: value.length >= MAX_GROUP_BY_LABEL_LENGTH ? STARTS_WITH : EQUALS,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      value: value,
      entity: groupBy.groupbyTagEntity
    };
  }
  return joinExpressions({ expressions: [formModel, sanitizeTagFilter(newTagFilter)] });
}
