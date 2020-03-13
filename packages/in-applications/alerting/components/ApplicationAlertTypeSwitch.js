export default function ApplicationAlertTypeSwitch({ alertType, ErrorRateComponent }) {
  if (alertType === 'errorRate') {
    return ErrorRateComponent();
  } else if (alertType === 'slowness') {
    return null;
  }
  return null;
}
