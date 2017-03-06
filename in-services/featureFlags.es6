import {config} from 'in-services/config';

const onlyInternally = config.tenant === 'instana' &&
  config.environment !== 'staging' &&
  config.tenantUnit !== 'current';

export const instanaInternalFeaturesEnabled = onlyInternally;

export const webVrEnabled = onlyInternally;
export const eumStatisticsEnabled = onlyInternally;
export const logViewEnabled = onlyInternally;
export const agentYamlConfigEnabled = onlyInternally;
export const customAltertingEnabled = onlyInternally;
export const auditLogEnabled = onlyInternally;
export const objectivesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
