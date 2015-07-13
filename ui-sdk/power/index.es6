'use strict';

import pbst from '../util/pluginBasedSnapshotTransformation';

const transformer = pbst('power');

export const addMapping = transformer.addMapping;
export const getPower = transformer.get;
