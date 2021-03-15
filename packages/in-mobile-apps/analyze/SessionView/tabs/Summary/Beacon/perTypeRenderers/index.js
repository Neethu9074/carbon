/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import * as sessionStart from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/SessionStartBeacon';
import * as httpRequest from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/HttpRequestBeacon';
import * as viewChange from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/ViewChangeBeacon';
import * as custom from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/CustomEventBeacon';

export default {
  sessionStart,
  httpRequest,
  custom,
  viewChange
};
