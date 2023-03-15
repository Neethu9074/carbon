/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button } from '@instana/components';

import { Entity, getEntityNameByType, getIconByType, ProductArea } from 'in-analyze/AnalyzeView/dataSources';
import ComboBoxOverlay from 'in-components/form/ComboBox/ComboBoxOverlay';
import Overlay from 'in-components/overlays/Overlay';
import { MetricSource } from 'in-types';
import { t } from 'in-i18n';

import locals from './ChartSelectorOverlay.mless';

interface ChartSelectorProps {
  dataSource: Entity;
  unifiedMetricsSource: MetricSource;

  value: ChartValue;
  options: ChartOptions;
  onChange: (v: ChartValue) => void;
  overlayContent: typeof ComboBoxOverlay;
  overlayProps: any;
}

interface ChartValue {
  aggregationId?: string;
  metricId?: string;
  rendererId?: string;
  templateId?: string;
  description?: string;
  label?: string;
  metrics?: ChartMetric[];
}

interface ChartOptions {
  [key: string]: ChartTemplate[] | ChartMetric[];
  templates: ChartTemplate[];
  metrics: ChartMetric[];
}

interface ChartTemplate {
  templateId: string;
  description: string;
  label: string;
  metrics: ChartMetric[];
}

interface ChartMetric {
  aggregations: ChartAggregation[];
  defaultAggregation: string;
  description: string;
  label: string;
  metricId: string;
  formatter: string;
  groupLabel?: string;
}

interface ChartAggregation {
  id: string;
  label: string;
  renderers: ChartRenderer[];
}

interface ChartRenderer {
  id: string;
  label: string;
  renderer: Render;
}

interface Render {
  onChange: (v: any) => void;
}

export default function ChartSelectorOverlay(props: ChartSelectorProps) {
  const { dataSource, unifiedMetricsSource, value, options, onChange, overlayContent, overlayProps } = props;

  const activeTemplate = options?.templates?.find(({ templateId }) => templateId === value?.templateId);
  let activeMetric = getActiveChartMetric(options, value);

  const getGroupName = (name: string) => {
    if (name === 'templates') {
      return t('in-components:chart.chartTemplates');
    }
    if (name.startsWith('_')) {
      return name.substring(1);
    } else {
      return getEntityNameByType(dataSource);
    }
  };

  const optionGroups = Object.getOwnPropertyNames(options);
  const nonEmptyGroupOptions = optionGroups
    .map(group => ({
      value: getGroupName(group),
      options: options[group]
    }))
    .filter(group => group.options?.length > 0);

  const getProductAreaFromMetricSource = (metricSource: string): ProductArea => {
    switch (metricSource) {
      case 'LOGS':
      case 'APPLICATION':
      case 'WEBSITE':
        return metricSource.toLowerCase() as ProductArea;
      case 'MOBILE_APP':
        return 'mobileApp';
      case 'INFRASTRUCTURE_METRICS':
        return 'infrastructure';
      default:
        return 'application';
    }
  };

  function isChartMetric(value: ChartMetric | ChartTemplate): value is ChartMetric {
    return Object.prototype.hasOwnProperty.call(value, 'metricId');
  }

  const overlayOnChange = (input: ChartMetric | ChartTemplate) => {
    let change = { ...value };

    // If we previously displayed a template, discard all previous values
    if (value?.templateId) {
      change = {};
    }

    if (isChartMetric(input)) {
      change = {
        ...change,
        metricId: input.metricId
      };

      const optionKey = input.groupLabel ? '_' + input.groupLabel : 'metrics';
      const metricOptions = options[optionKey];

      const metric = (metricOptions as ChartMetric[])?.find(opt => opt.metricId === input.metricId);
      let aggregation = metric?.aggregations?.find(opt => opt.id === change.aggregationId);
      if (!aggregation) {
        aggregation = metric?.aggregations?.[0];
        change.aggregationId = aggregation?.id;
      }

      const renderer = aggregation?.renderers?.find(opt => opt.id === change.rendererId);
      if (!renderer) {
        change.rendererId = aggregation?.renderers?.[0]?.id;
      }
    } else {
      const template = options?.templates?.find(template => template.templateId === input.templateId);

      const metrics = template?.metrics?.map((metric: ChartMetric) => {
        return {
          ...metric,
          aggregationId: metric.defaultAggregation ?? metric.aggregations[0]
        };
      });

      change = {
        templateId: input.templateId,
        metrics
      };
    }

    onChange(change);
  };

  return (
    <Overlay
      align="bottomRight"
      content={overlayContent}
      props={{
        ...overlayProps,
        options: nonEmptyGroupOptions,
        value: activeMetric?.metricId || activeTemplate?.templateId,
        onChange: (newValue: ChartTemplate | ChartMetric) => {
          overlayOnChange(newValue);
        }
      }}
    >
      {({ toggle }) =>
        value ? (
          <Button
            kind="subtle"
            size="compact"
            iconSize="regular"
            icon={getIconByType(dataSource, getProductAreaFromMetricSource(unifiedMetricsSource))}
            className={locals.buttonWithBorder}
            onClick={toggle}
          >
            <span>
              {(activeTemplate?.label || activeMetric?.label) && (
                <span className={locals.label}>{activeTemplate?.label || activeMetric?.label}</span>
              )}
              {activeTemplate && activeTemplate.description && (
                <span className={locals.templateDescription}>{activeTemplate?.description}</span>
              )}
            </span>
          </Button>
        ) : (
          <Button kind="subtle" size="compact" icon="lib_openclose_add" onClick={toggle}>
            <span>{t('in-components:chartingConfigurator.buttonAddChart')}</span>
          </Button>
        )
      }
    </Overlay>
  );
}

export function getEmptyChartMetric() {
  return {
    aggregations: [],
    defaultAggregation: '',
    description: '',
    label: '',
    metricId: '',
    formatter: ''
  };
}

export function getActiveChartMetric(options: ChartOptions, value: ChartValue) {
  let activeMetric: ChartValue = getEmptyChartMetric();
  let keys = Object.getOwnPropertyNames(options);
  if (keys.find(key => key.startsWith('_'))) {
    keys.forEach(key =>
      options[key].forEach(option => {
        if ((option as ChartValue)?.metricId === value?.metricId) {
          activeMetric = option;
        }
      })
    );
  } else {
    activeMetric = options?.metrics?.find(({ metricId }) => metricId === value?.metricId) || options?.metrics?.[0];
  }
  return activeMetric;
}
