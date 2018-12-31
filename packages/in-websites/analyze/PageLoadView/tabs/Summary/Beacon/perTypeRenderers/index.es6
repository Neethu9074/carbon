import * as resourceLoad from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers/ResourceLoadBeacon';
import * as httpRequest from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers/HttpRequestBeacon';
import * as pageTransition from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers/SpaBeacon';
import * as custom from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers/CustomEventBeacon';
import * as pageLoad from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers/PageLoadBeacon';
import * as error from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers/ErrorBeacon';

export default {
  pageLoad,
  resourceLoad,
  httpRequest,
  error,
  pageTransition,
  custom
};
