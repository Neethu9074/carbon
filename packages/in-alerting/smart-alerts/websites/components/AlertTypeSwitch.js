/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

export default function AlertTypeSwitch({
  alertType,
  renderJsErrors,
  renderSlowness,
  renderStatusCode,
  renderThroughput
}) {
  if (alertType === 'specificJsError') {
    return renderJsErrors();
  } else if (alertType === 'statusCode') {
    return renderStatusCode();
  } else if (alertType === 'slowness') {
    return renderSlowness();
  } else if (alertType === 'throughput') {
    return renderThroughput();
  }
}

AlertTypeSwitch.propTypes = {
  alertType: PropTypes.string.isRequired,
  renderJsErrors: PropTypes.func.isRequired,
  renderSlowness: PropTypes.func.isRequired,
  renderStatusCode: PropTypes.func.isRequired,
  renderThroughput: PropTypes.func.isRequired
};
