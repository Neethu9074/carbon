import PropTypes from 'prop-types';

import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';

export default function AlertTypeSwitch({ alertType, renderJsErrors, renderSlowness, renderStatusCode }) {
  if (alertType === alertTypes.specificJsError) {
    return renderJsErrors();
  } else if (alertType === alertTypes.specificStatusCode) {
    return renderStatusCode();
  } else if (alertType === alertTypes.slowness) {
    return renderSlowness();
  }
}

AlertTypeSwitch.propTypes = {
  alertType: PropTypes.string.isRequired,
  renderJsErrors: PropTypes.func.isRequired,
  renderSlowness: PropTypes.func.isRequired,
  renderStatusCode: PropTypes.func.isRequired
};
