import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';

import instanaTableDefinition from 'in-forge/plugins/finagleApplicationContainer/instanaTableDefinition';

const tableDefinition = instanaInternalFeaturesEnabled ? instanaTableDefinition : undefined;
export default tableDefinition;
