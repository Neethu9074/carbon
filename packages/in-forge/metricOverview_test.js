/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-console */

import path from 'path';
import fs from 'fs';

import { metricDefinitions as allMetricDefinitions } from 'in-sdk/metrics/metricDefinitions';
import { plugins as allPlugins, applicationPlugins } from 'in-forge/constants';
import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { getFormatterType } from 'in-services/formatters/number';
import { getPluginName } from 'in-sdk/pluginName';

ensureInfraPluginsAreEvaluated();

const oneZeroEntitiesDeprecationReason =
  'Deprecated: Entities of this type are only available to environments still running Classic Mode.';

const ignoredPlugins = [
  'defaultEntity20', // is a pseudo-entity only used for inheritance in the UI for AP/S/E entities
  'application', // because the export is only used in infra metrics API
  'service', // because the export is only used in infra metrics API
  'endpoint', // because the export is only used in infra metrics API
  'processingStatistics', // because it is an internal technical entity
  'processingStatisticsMember' // because it is an internal technical entity
];

if (process.env.GENERATE_METRIC_OVERVIEW) {
  describe.only('in-forge/metricOverview', doGenerate);
} else {
  test('placeholder so that at least one test is defined in this file', () => {});
}

function doGenerate() {
  const pluginsFromMetricDefinitions = Object.keys(allMetricDefinitions);
  const relevantPlugins = pluginsFromMetricDefinitions.filter(plugin => !ignoredPlugins.includes(plugin));

  const isStaticMetric = metric => typeof metric.label === 'string' && typeof metric.metric === 'string';

  // Removes metrics using a raw pattern defined by getCustomMetricMatch, such as JVM JMX.
  // This check works, because each metric pattern always has a prefix so far.
  const isDynamicMetric = metric => typeof metric.metric === 'object' && typeof metric.metric.pre === 'string';

  it('must generate static metric overview for docs', () => {
    const plugins = pluginsFromMetricDefinitions.sort((a, b) => getPluginName(a, 2).localeCompare(getPluginName(b, 2)));

    let str = '';

    plugins.forEach(plugin => {
      const metrics = allMetricDefinitions[plugin]
        .filter(isStaticMetric)
        .sort((a, b) => a.label.localeCompare(b.label));

      if (metrics.length === 0) {
        return;
      }

      str += `**${getPluginName(plugin, 2)}** *(${plugin})*\n\n`;

      if (!allPlugins[plugin]) {
        str += `${oneZeroEntitiesDeprecationReason}\n\n`;
      }

      if (applicationPlugins[plugin]) {
        str += `These entities are part of Instana's Application Perspectives capabilities.\n\n`;
      }

      metrics.forEach(metric => {
        str += ` - **${metric.label}:** \`${metric.metric}\`\n`;
      });

      str += '\n\n';
    });

    const targetFileName = path.join(process.cwd(), 'metricOverviewForDocs.md');
    fs.writeFileSync(targetFileName, str.trim());
    console.log('Metric overview written to %s', targetFileName);
  });

  it('must generate static metric overview for Grafana plugin', () => {
    const result = pluginsFromMetricDefinitions.reduce((plugins, pluginName) => {
      const metrics = allMetricDefinitions[pluginName].filter(isStaticMetric).reduce((agg, metric) => {
        agg[metric.metric] = metric.label;
        return agg;
      }, {});
      const deprecated = Boolean(!allPlugins[pluginName]);
      plugins[pluginName.toLowerCase()] = {
        label: getPluginName(pluginName, 2),
        deprecated: Boolean(!allPlugins[pluginName]),
        deprecationReason: deprecated ? oneZeroEntitiesDeprecationReason : undefined,
        metrics
      };
      return plugins;
    }, {});

    const targetFileName = path.join(process.cwd(), 'metricOverviewForGrafana.ts');
    const content = `export default ${JSON.stringify(result, 0, 2)};`;
    fs.writeFileSync(targetFileName, content);
    console.log('Metric overview for Grafana written to %s', targetFileName);
  });

  it('must generate static and dynamic metric definitions for UI backend', () => {
    const PLACEHOLDER = '<placeholder>';
    const patterMetricWithPlaceholder = metric => {
      const { pre, post } = metric;

      if (pre != null && post != null) {
        return `${pre}.${PLACEHOLDER}.${post}`;
      }
      if (pre != null) {
        return `${pre}.${PLACEHOLDER}`;
      }

      throw Error(`Unexpected metric pattern w/o prefix: ${metric}`);
    };

    const result = relevantPlugins.reduce((plugins, pluginName) => {
      const metrics = allMetricDefinitions[pluginName]
        .filter(metric => isStaticMetric(metric) || isDynamicMetric(metric))
        .map(metric => {
          const category = metric.category.length > 0 ? metric.category[0] : null;
          const label = typeof metric.label === 'function' ? metric.label() : metric.label;
          const description = category == null ? label : `${category} ${label}`;
          const baseMetricDefinition = {
            formatter: getFormatterType(metric.formatter),
            label,
            description,
            category,
            entityType: pluginName
          };

          if (isDynamicMetric(metric)) {
            return {
              type: 'DYNAMIC',
              ...baseMetricDefinition,
              metricId: patterMetricWithPlaceholder(metric.metric),
              metricPrefix: metric.metric.pre,
              metricPostfix: metric.metric.post,
              metricPlaceholderLabel: metric.metric.placeholderLabel
            };
          }

          return {
            type: 'STATIC',
            ...baseMetricDefinition,
            metricId: metric.metric
          };
        });

      if (metrics.length > 0) {
        plugins[pluginName] = metrics;
      }
      return plugins;
    }, {});

    const targetFileName = path.join(process.cwd(), 'metricDefinitionsForUiBackend.json');
    const content = `${JSON.stringify(result, 0, 2)}`;
    fs.writeFileSync(targetFileName, content);
    console.log('Dynamic metric overview for ui backend written to %s', targetFileName);
  });
}
