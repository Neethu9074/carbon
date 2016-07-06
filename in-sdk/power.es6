import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';

const transformer = pbst('power');

export const addMapping = transformer.addMapping;
export const getPower = transformer.get;
