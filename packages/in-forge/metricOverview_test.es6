/* eslint-env mocha, node */
/* eslint-disable no-console, mocha/no-exclusive-tests */

import path from 'path';
import fs from 'fs';

import { metricDefinitions as allMetricDefinitions } from 'in-sdk/metrics/metricDefinitions';
import { pluginsDeprecatedIn20, applicationPlugins } from 'in-forge/constants';
import { getPlural } from 'in-sdk/pluginName';

const oneZeroEntitiesDeprecationReason =
  'Deprecated: Entities of this type are only available to environments still running Classic Mode.';

if (process.env.GENERATE_METRIC_OVERVIEW) {
  describe.only('in-forge/metricOverview', doGenerate);
}

function doGenerate() {
  it('must generate a metric overview for docs', () => {
    const plugins = Object.keys(allMetricDefinitions).sort((a, b) => getPlural(a).localeCompare(getPlural(b)));

    let str = '';

    plugins.forEach(plugin => {
      const metrics = allMetricDefinitions[plugin]
        .filter(metric => typeof metric.label === 'string' && typeof metric.metric === 'string')
        .sort((a, b) => a.label.localeCompare(b.label));

      if (metrics.length === 0) {
        return;
      }

      str += `**${getPlural(plugin)}** *(${plugin})*\n\n`;

      if (pluginsDeprecatedIn20[plugin]) {
        str += `${oneZeroEntitiesDeprecationReason}\n\n`;
      }

      if (applicationPlugins[plugin]) {
        str +=
          `These entities are part of Instana's Application Perspectives capabilities. Add the query ` +
          `parameter \`newApplicationModelEnabled=true\` to your API calls when searching for / working ` +
          `with these types of entities.\n\n`;
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
      const deprecated = Boolean(pluginsDeprecatedIn20[pluginName]);
      plugins[pluginName.toLowerCase()] = {
        label: getPlural(pluginName),
        deprecated: Boolean(pluginsDeprecatedIn20[pluginName]),
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
}
