import {isInstanaTenant} from 'in-services/config';

import instanaTableDefinition from 'in-forge/plugins/dropwizardApplicationContainer/instanaTableDefinition';

const tableDefinition = isInstanaTenant() ? instanaTableDefinition : undefined;
export default tableDefinition;
