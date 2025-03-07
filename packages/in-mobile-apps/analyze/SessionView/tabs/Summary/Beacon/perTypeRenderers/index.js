/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import * as sessionStart from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/SessionStartBeacon';
import * as httpRequest from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/HttpRequestBeacon';
import * as viewChange from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/ViewChangeBeacon';
import * as dropBeacon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/DroppedBeacon';
import * as custom from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/CustomEventBeacon';
import * as perf from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import * as crash from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/CrashBeacon';

export default {
  sessionStart,
  httpRequest,
  custom,
  viewChange,
  crash,
  perf,
  dropBeacon
};
