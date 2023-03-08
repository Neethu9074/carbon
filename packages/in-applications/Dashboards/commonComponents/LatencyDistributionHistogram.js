/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import LatencyDistributionBase10Chart from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-applications/subscriptions/getLatencyDistributionBase10';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { jumpToUnboundedAnalyticsFromLatencyTracker } from 'in-applications/tracker';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { createChartedMetric, createOrderBy } from 'in-analyze/navigation/paths';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { filterByEndpointType } from './includeEndpointTypes';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { fixateTimeConfig } from 'in-stores/time/config';
import IconLink from 'in-components/IconButton/IconLink';
import { emptyObject } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './LatencyDistributionHistogram.mless';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  syntheticCalls,
  endpointTypes,
  rightHeaderContent,
  cardTitle,
  renderHistoricDataIndicator = false,
  renderWidgetNotSupportedIndicator = false
}) {
  const [selectedLatencyRange, setSelectedLatencyRange] = useState({ from: null, to: null });
  const [hasApproximateData, setApproximateData] = useState(false);
  const timeShiftConfig = useTimeShiftConfig();

  const hiddenCalls = createHiddenCallsFromSyntheticOption(syntheticCalls);

  const latencyFacet =
    !selectedLatencyRange.from && !selectedLatencyRange.to ? emptyObject : { 'call.latency': [selectedLatencyRange] };

  const latencyDistRequest = {
    includePercentiles: true,
    ...hiddenCalls,
    filter: {
      timeConfig: {
        ...timeConfig,
        autoRefresh: false
      }
    },
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
          stringValue: applicationId,
          operator: EQUALS
        },
        {
          type: 'TAG_FILTER',
          name: 'service.id',
          stringValue: serviceId,
          operator: EQUALS
        },
        {
          type: 'TAG_FILTER',
          name: 'endpoint.id',
          stringValue: endpointId,
          operator: EQUALS
        }
      ]
        // filter out filters with missing values
        .filter(e => e.stringValue != null)
    }
  };
  const timeShiftLatencyDistRequest = {
    ...latencyDistRequest,
    includePercentiles: false,
    timeShift: translateOffsetToTimeShiftConfig(timeShiftConfig.offset, timeConfig)
  };

  const LeftHeaderContent = () => {
    return (
      <>
        {renderHistoricDataIndicator && hasApproximateData && (
          <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
        )}
        {renderWidgetNotSupportedIndicator && (
          <Tooltip content={t('in-components:liveModeIndicator.widgetNotSupportedInLiveMode')}>
            <IconLink type="lib_help_error_info_outline" className={locals.liveModeIcon} />
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <Card
      className={renderWidgetNotSupportedIndicator ? locals.disabledWidget : null}
      title={cardTitle}
      leftHeaderContent={<LeftHeaderContent />}
      rightHeaderContent={rightHeaderContent}
      size="l"
    >
      <LatencyDistributionBase10Chart
        dataSource="calls"
        subscription={getLatencyDistributionBase10(latencyDistRequest)}
        timeShiftSubscription={timeShiftConfig.offset && getLatencyDistributionBase10(timeShiftLatencyDistRequest)}
        selectionMenuItems={[
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: () =>
              getJumpToAnalyzeHref$(
                { applicationId: applicationId, serviceId: serviceId, endpointId: endpointId },
                {
                  timeConfig: fixateTimeConfig(timeConfig),
                  boundaryScope,
                  formModel: joinExpressions({
                    expressions: [
                      createFormModelFromSyntheticOption(syntheticCalls),
                      ...filterByEndpointType(endpointTypes)
                    ]
                  }),
                  facets: latencyFacet,
                  hiddenCalls,
                  chartedMetrics: [createChartedMetric('latency', 'DISTRIBUTION')],
                  orderBy: createOrderBy('latency', 'DESC')
                }
              ),
            onClick: () => {
              jumpToUnboundedAnalyticsFromLatencyTracker({
                applicationId: applicationId,
                serviceId: serviceId,
                endpointId: endpointId,
                boundaryScope: boundaryScope,
                from: selectedLatencyRange.from,
                to: selectedLatencyRange.to
              });
            }
          }
        ]}
        onSelectionChanged={setSelectedLatencyRange}
        showLegend
        timeShiftConfig={timeShiftConfig}
        setApproximateData={setApproximateData}
        renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
      />
    </Card>
  );
}
