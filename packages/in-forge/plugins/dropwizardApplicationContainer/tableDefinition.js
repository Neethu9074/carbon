import { internalMonitoringUnit } from 'in-services/featureFlags';

import instanaTableDefinition from 'in-forge/plugins/dropwizardApplicationContainer/instanaTableDefinition';

const tableDefinition = internalMonitoringUnit ? instanaTableDefinition : undefined;
export default tableDefinition;
