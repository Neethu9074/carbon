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
  let render;
  if (alertType === 'errors') {
    render = renderErrorRate;
  } else if (alertType === 'logs') {
    render = renderLogs;
  } else if (alertType === 'statusCode') {
    render = renderStatusCode;
  } else if (alertType === 'slowness') {
    render = renderSlowness;
  } else if (alertType === 'throughput') {
    render = renderThroughput;
  }
  return render?.(props) ?? null;
}

AlertTypeSwitch.propTypes = {
  alertType: PropTypes.string.isRequired,
  renderErrorRate: PropTypes.func,
  renderSlowness: PropTypes.func,
  renderLogs: PropTypes.func,
  renderStatusCode: PropTypes.func,
  renderThroughput: PropTypes.func
};
