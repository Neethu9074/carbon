import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';

const transformer = pbst('kpi');

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
