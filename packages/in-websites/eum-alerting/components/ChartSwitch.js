import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';

export default function ChartSwitch({ alertType, JsErrorsComponent, SlownessComponent }) {
  if (alertType === alertTypes.specificJsError) {
    return JsErrorsComponent();
  }
  return SlownessComponent();
}
