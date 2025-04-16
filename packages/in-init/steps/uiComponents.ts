/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* global require:false */

require('in-services/browser').init();
require('in-stores/timeOffset').init();
require('in-shortcuts').init();
require('in-services/security/csrf').init();
require('in-stores/usageInfo').init();
require('in-stores/maintenance').init();
require('in-services/unhandledErrors').init();
require('in-stores/events').init();
require('in-services/favicon').init();
require('in-services/tracking/tracking').init();
require('in-components/SelectedElementHighlighter').init();
require('in-events/releases/releases').init();
require('in-components/uiClientUpdateMessage/uiClientUpdate').init();
require('in-plg/components/DataConsumptionMessage/DataConsumptionMessage').init();
