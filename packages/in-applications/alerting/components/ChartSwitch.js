import { alertTypes } from 'in-applications/alerting/data/alertTypeConfigData';

export default function ChartSwitch({ alertType, ErrorRateComponent }) {
  if (alertType === alertTypes.errorRate) {
    return ErrorRateComponent();
  } else if (alertType === alertTypes.slowness) {
    return null;
  }
  return null;
}
