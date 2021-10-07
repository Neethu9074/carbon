/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import { MetricSelectionButton } from 'in-components/ChartingConfigurator/MetricSelectionButton';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { getEntityNameByType } from 'in-analyze/AnalyzeView/dataSources';
import { t } from 'in-i18n';

import locals from './ChartSelectorOverlay.mless';

export default function ChartSelectorOverlay(props) {
  const { dataSource, unifiedMetricsSource, value, options, onChange, overlayContent, overlayProps } = props;

  const activeTemplate = options?.templates?.find(({ templateId }) => templateId === value?.templateId);
  const activeMetric = options?.metrics?.find(({ metricId }) => metricId === value?.metricId);

  const getGroupName = name => {
    if (name === 'templates') {
      return t('in-components:chart.chartTemplates');
    }
    return getEntityNameByType(dataSource);
  };

  const optionGroups = Object.getOwnPropertyNames(options);
  const nonEmptyGroupOptions = optionGroups
    .map(group => ({
      value: getGroupName(group),
      options: options[group]
    }))
    .filter(group => group.options?.length > 0);

  return (
    <ComboBoxBehavior
      options={nonEmptyGroupOptions}
      value={activeMetric?.metricId || activeTemplate?.templateId}
      overlayContent={overlayContent}
      overlayProps={overlayProps}
      onChange={input => {
        const metricId = input.metricId;
        const templateId = input.templateId;

        let change = { ...value };

        // If we previously displayed a template, discard all previous values
        if (value?.templateId) {
          change = {};
        }

        if (metricId) {
          change = {
            ...change,
            metricId
          };
          const metric = options?.metrics?.find(opt => opt.metricId === metricId);
          let aggregation = metric?.aggregations?.find(opt => opt.id === change.aggregationId);
          if (!aggregation) {
            aggregation = metric?.aggregations?.[0];
            change.aggregationId = aggregation?.id;
          }

          const renderer = aggregation?.renderers?.find(opt => opt.id === change.rendererId);
          if (!renderer) {
            change.rendererId = aggregation?.renderers?.[0]?.id;
          }
        } else if (templateId) {
          const template = options?.templates?.find(template => template.templateId === templateId);

          const metrics = template?.metrics?.map(({ defaultAggregation, aggregations, metricId }) => {
            return {
              metricId,
              aggregationId: defaultAggregation ?? aggregations[0]
            };
          });

          change = {
            templateId,
            metrics
          };
        }

        onChange(change);
      }}
      requiresCustomInteractivity
      aria-label={t('in-components:chartingConfigurator.labelChangeSelectedMetric')}
    >
      {({ elementProps }) =>
        value ? (
          <div {...elementProps} className={classNames(locals.metric, locals.selectable)}>
            <span className={locals.selectAbleWithIcon}>
              <MetricSelectionButton
                metric={activeMetric}
                template={activeTemplate}
                dataSource={dataSource}
                metricsSource={unifiedMetricsSource}
              />
            </span>
          </div>
        ) : (
          <Button {...elementProps} kind="subtle" size="compact" icon="lib_openclose_add">
            <span>{t('in-components:chartingConfigurator.buttonAddChart')}</span>
          </Button>
        )
      }
    </ComboBoxBehavior>
  );
}
