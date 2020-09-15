import { track, AMP_TENANT_UNIT_CHANGED } from 'in-services/tracking/tracking';

export const tenantUnitChanged = config => track(AMP_TENANT_UNIT_CHANGED, config);
