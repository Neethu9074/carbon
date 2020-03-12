import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';

export default function AlertTypeSwitch({ alertType, JsErrorsComponent, SlownessComponent, StatusCodeComponent }) {
  if (alertType === alertTypes.specificJsError) {
    return JsErrorsComponent();
  } else if (alertType === alertTypes.specificStatusCode) {
    return StatusCodeComponent();
  } else if (alertType === alertTypes.slowness) {
    return SlownessComponent();
  }
  return null;
}
