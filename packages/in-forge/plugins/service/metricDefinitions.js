/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/defaultEntity20/metricDefinitions';
export default metricDefinitions.filter(definition => definition.metric !== 'instances');
