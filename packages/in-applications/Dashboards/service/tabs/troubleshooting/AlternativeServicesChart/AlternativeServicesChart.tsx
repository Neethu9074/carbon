/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, ReactNode, useState } from 'react';
import classNames from 'classnames';

import { KeyValue, Li, SvgIcon, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';

import AlternativeServicesChartPresenter from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/AlternativeServicesChartPresenter';
import {
  availableCorrelationTags,
  CorrelationTag
} from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/correlationTags';
import AlternativeServicesTopList from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/AlternativeServicesTopList';
import { AggregationType, PaginatedResult, Result, ServiceItem, TagFilterEntity, TimeConfig } from 'in-types';
import getServicesCorrelatedByTag from 'in-applications/subscriptions/getServicesCorrelatedByTag';
import { OverlayContentProps } from 'in-components/overlays/Overlay/types';
import DropdownButton from 'in-components/Button/DropdownButton';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Renderer } from 'in-components/Chart/renderer/types';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { FormatterFn } from 'in-stores/metric/formatters';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { pendingResult } from 'in-services/fixedObjects';

import locals from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/AlternativeServicesChartPresenter.mless';

export interface MetricDefinition {
  label: string;
  metric: string;
  aggregation: AggregationType;
  formatter: FormatterFn;
  renderer: Renderer;
  fallbackMetricValue?: [number, number][];
}

export interface AlternativeServicesChartWrapperProps {
  timeConfig: TimeConfig;
  serviceId: string;
  cardHeader?: ReactElement;
  title?: string;
  metricDefinition: MetricDefinition;
  renderInfoBox?: () => ReactNode;
}

export default function AlternativeServicesChartWrapper(props: AlternativeServicesChartWrapperProps) {
  const { timeConfig, serviceId, metricDefinition } = props;

  const [selectedCorrelationTag, setSelectedCorrelationTag] = useState<CorrelationTag>(availableCorrelationTags[0]);

  const result: Result<PaginatedResult<ServiceItem>> =
    useObservable(getServicesCorrelationByTagObservable, [
      timeConfig,
      serviceId,
      selectedCorrelationTag.correlationTag,
      selectedCorrelationTag.correlationTagEntity,
      selectedCorrelationTag.correlationTagSecondLevelKey
    ]) ?? pendingResult;

  const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  const tagSelection = ({ close }: OverlayContentProps) => {
    const items = availableCorrelationTags.map((value: CorrelationTag) => {
      return (
        <Li
          key={value.correlationTag}
          className={classNames(locals.option, locals.alignLeft)}
          onClick={() => {
            setSelectedCorrelationTag(value);
            close();
          }}
        >
          <SvgIcon type={'lib_views_tag'} />
          <KeyValue
            className={locals.optionValueMargin}
            label={value.label}
            value={`${value.correlationTagSecondLevelKey ?? ''}${value.correlationTag}`}
            accentuated
          />
        </Li>
      );
    });

    return <Ul>{items}</Ul>;
  };

  const tagSelectionOverlay = (
    <Overlay align="bottomRight" content={tagSelection}>
      {({ toggle }) => {
        return <DropdownButton onClick={toggle}>{selectedCorrelationTag.label}</DropdownButton>;
      }}
    </Overlay>
  );

  return (
    <>
      <Row>
        <Col xs>
          <AlternativeServicesChartPresenter
            {...props}
            result={result}
            rightHeaderContent={tagSelectionOverlay}
            metricDefinition={metricDefinition}
            renderPostChartContent={props.renderInfoBox}
            renderHistoricDataIndicator={hasApproximateData}
            translateLabel={(id: string) => {
              const serviceItem = result?.data?.items?.find((item: ServiceItem) => item.service.id === id);
              return serviceItem?.service?.label ?? id;
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <AlternativeServicesTopList result={result} cardHeader={tagSelectionOverlay} />
        </Col>
      </Row>
    </>
  );
}

function getServicesCorrelationByTagObservable([
  timeConfig,
  serviceId,
  correlationTag,
  correlationTagEntity,
  correlationTagSecondLevelKey
]: [TimeConfig, string, string, TagFilterEntity, string?]) {
  return getServicesCorrelatedByTag({
    serviceId,
    correlationTag,
    correlationTagEntity,
    correlationTagSecondLevelKey,
    pagination: {
      page: 1,
      pageSize: 20
    },
    order: {
      by: 'callsAgg',
      direction: 'DESC'
    },
    metrics: {
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getChartGranularity(timeConfig)
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      }
    },
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    queryPrecision: 'FULL'
  });
}
