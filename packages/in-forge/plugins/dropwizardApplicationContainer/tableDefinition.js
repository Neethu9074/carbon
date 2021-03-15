/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import instanaTableDefinition from 'in-forge/plugins/dropwizardApplicationContainer/instanaTableDefinition';
import { internalMonitoringUnit } from 'in-services/featureFlags';

const tableDefinition = internalMonitoringUnit ? instanaTableDefinition : undefined;
export default tableDefinition;
