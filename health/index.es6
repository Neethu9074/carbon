'use strict';

import pbst from '../util/pluginBasedSnapshotTransformation';

const transformer = pbst('health');

export const health = {
  ok: 'ok',
  warning: 'warning',
  danger: 'danger'
};

export const addMapping = transformer.addMapping;
export const getHealth = transformer.get;
