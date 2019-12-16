import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';

export default function ChartSwitch({ form, JsErrorsComponent, SlownessComponent }) {
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    return JsErrorsComponent();
  }
  return SlownessComponent();
}
