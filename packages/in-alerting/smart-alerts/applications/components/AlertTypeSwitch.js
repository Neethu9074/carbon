/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

export default function AlertTypeSwitch({
  alertType,
  renderErrorRate,
  renderSlowness,
  renderLogs,
  renderStatusCode,
  renderThroughput,
  ...props
}) {
  if (alertType === 'errorRate') {
    return renderErrorRate(props);
  } else if (alertType === 'slowness') {
    return renderSlowness(props);
  } else if (alertType === 'logs') {
    return renderLogs(props);
  } else if (alertType === 'statusCode') {
    return renderStatusCode(props);
  } else if (alertType === 'throughput') {
    return renderThroughput(props);
  }
}

AlertTypeSwitch.propTypes = {
  alertType: PropTypes.string.isRequired,
  renderErrorRate: PropTypes.func.isRequired,
  renderSlowness: PropTypes.func.isRequired,
  renderLogs: PropTypes.func.isRequired,
  renderStatusCode: PropTypes.func.isRequired,
  renderThroughput: PropTypes.func.isRequired
};
