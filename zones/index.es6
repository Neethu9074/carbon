'use strict';

import pbst from '../util/pluginBasedSnapshotTransformation';

const transformer = pbst('zones');

export const addMapping = transformer.addMapping;
export const getZone = transformer.get;
