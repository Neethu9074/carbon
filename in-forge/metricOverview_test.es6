/* eslint-env mocha, node */
/* eslint-disable no-console, mocha/no-exclusive-tests */

import {metricDefinitions} from 'in-sdk/metrics/metricDefinitions';
import {getPlural} from 'in-sdk/pluginName';

if (process.env.GENERATE_METRIC_OVERVIEW) {
  describe.only('in-forge/metricOverview', doGenerate);
}

function doGenerate() {
  it('must generate a metric overview', () => {
    const plugins = Object.keys(metricDefinitions)
      .sort((a, b) => getPlural(a).localeCompare(getPlural(b)));

    let str = '';

    plugins.forEach(plugin => {
      const metrics = metricDefinitions[plugin]
        .filter(metric => typeof metric.label === 'string' && typeof metric.metric === 'string')
        .sort((a, b) => a.label.localeCompare(b.label));

      if (metrics.length === 0) {
        return;
      }

      str += `**${getPlural(plugin)}** *(${plugin})*\n\n`;

      metrics
        .forEach(metric => {
          str += ` - **${metric.label}:** \`${metric.metric}\`\n`;
        });

        str += '\n\n';
    });

    console.log(str.trim());
  });
}
