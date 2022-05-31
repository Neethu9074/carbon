/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { renderHistoricBaseline } from 'in-alerting/components/Chart/renderer/historicBaseline';
import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ colors50, colors100, scale, config, metrics }) => {
    validateProps(config);
    const metric = metrics[0];

    renderHistoricBaseline(config, scale, colors50, colors100);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0], scale, config });
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
  }
};

function validateProps(config) {
  if (__DEV__) {
    invariant(
      Number(config.y1.sensitivity) >= 0,
      'Property "sensitivity" is missing in config. Example: y1={{ sensitivity, colors:[], ... }}'
    );
  }
}
