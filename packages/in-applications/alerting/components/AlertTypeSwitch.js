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
  renderThroughput
}) {
  if (alertType === 'errorRate') {
    return renderErrorRate();
  } else if (alertType === 'slowness') {
    return renderSlowness();
  } else if (alertType === 'logs') {
    return renderLogs();
  } else if (alertType === 'statusCode') {
    return renderStatusCode();
  } else if (alertType === 'throughput') {
    return renderThroughput();
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
