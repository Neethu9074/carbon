/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button } from '@instana/legacy';

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
  secondLevelMetricId?: string;
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
  secondLevelMetricId?: string;
  formatter: string;
  groupLabel?: string;
  customMetric?: boolean;
  metricTagSuggestions?: { label: string; value: string }[];
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

  const getGroupName = (name: string, option: ChartMetric | ChartTemplate) => {
    if (name === 'templates') {
      return t('in-components:chart.chartTemplates');
    }
    const groupLabel = (option as ChartMetric).groupLabel;
    if (groupLabel) {
      return groupLabel;
    } else {
      return getEntityNameByType(dataSource);
    }
  };

  const optionGroups = Object.getOwnPropertyNames(options);
  const groups: { value: string; options: (ChartMetric | ChartTemplate)[] }[] = [];
  optionGroups.forEach(key => {
    options[key].forEach(option => {
      const groupName = getGroupName(key, option);
      let group = groups.find(g => g.value === groupName);
      if (!group) {
        group = { value: groupName, options: [] };
        groups.push(group);
      }
      group.options.push(option);
    });
  });

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
    let change: ChartValue = { ...value };

    // If we previously displayed a template or custom metric, discard all previous values
    if (value?.templateId || value?.secondLevelMetricId) {
      change = {};
    }

    if (isChartMetric(input)) {
      if (isCustomChartMetric(input)) {
        change = {
          ...change,
          metricId: `${input.metricId}`,
          secondLevelMetricId: ''
        };
      } else {
        change = {
          ...change,
          secondLevelMetricId: undefined,
          metricId: input.metricId
        };
      }

      const metric = options.metrics?.find(opt => opt.metricId === input.metricId);
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
        options: groups,
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

export function getActiveChartMetric(options: ChartOptions, value: ChartValue): ChartMetric | undefined {
  for (let key of Object.getOwnPropertyNames(options)) {
    for (let option of options[key]) {
      const chartMetric = option as ChartMetric;
      if (
        chartMetric.metricId === value?.metricId ||
        (isCustomChartMetric(chartMetric) && value?.metricId?.startsWith(chartMetric.metricId))
      ) {
        return chartMetric;
      }
    }
  }
  return undefined;
}

function isCustomChartMetric(input: ChartMetric): boolean {
  return input.customMetric === true;
}
