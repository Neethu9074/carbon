/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */
/* eslint-disable no-console, mocha/no-exclusive-tests */

import path from 'path';
import fs from 'fs';

import { metricDefinitions as allMetricDefinitions } from 'in-sdk/metrics/metricDefinitions';
import { plugins as allPlugins, applicationPlugins } from 'in-forge/constants';
import { getPluginName } from 'in-sdk/pluginName';

const oneZeroEntitiesDeprecationReason =
  'Deprecated: Entities of this type are only available to environments still running Classic Mode.';

if (process.env.GENERATE_METRIC_OVERVIEW) {
  describe.only('in-forge/metricOverview', doGenerate);
}

function doGenerate() {
  it('must generate a metric overview for docs', () => {
    const plugins = Object.keys(allMetricDefinitions).sort((a, b) =>
      getPluginName(a, 2).localeCompare(getPluginName(b, 2))
    );

    let str = '';

    plugins.forEach(plugin => {
      const metrics = allMetricDefinitions[plugin]
        .filter(metric => typeof metric.label === 'string' && typeof metric.metric === 'string')
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

  it('must generate a metric overview for Grafana plugin', () => {
    const result = Object.keys(allMetricDefinitions).reduce((plugins, pluginName) => {
      const metrics = allMetricDefinitions[pluginName]
        .filter(metric => typeof metric.label === 'string' && typeof metric.metric === 'string')
        .reduce((agg, metric) => {
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

  it('must generate a metric overview for UI backend', () => {
    const result = Object.keys(allMetricDefinitions).reduce((plugins, pluginName) => {
      const metrics = allMetricDefinitions[pluginName]
        .filter(metric => typeof metric.label === 'string' && typeof metric.metric === 'string')
        .map(metric => {
          return {
            formatter: 'UNDEFINED',
            label: getPluginName(pluginName, 2) + ' ' + metric.label,
            description: metric.label,
            metricId: metric.metric,
            pluginId: pluginName,
            custom: false
          };
        });
      plugins[pluginName] = metrics;
      return plugins;
    }, {});

    const targetFileName = path.join(process.cwd(), 'metricOverviewForUiBackend.json');
    const content = `${JSON.stringify(result, 0, 2)}`;
    fs.writeFileSync(targetFileName, content);
    console.log('Metric overview for ui backend written to %s', targetFileName);
  });
}
