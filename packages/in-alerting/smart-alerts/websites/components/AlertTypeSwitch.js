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
  renderThroughput,
  renderCustomEvent
}) {
  let render;
  if (alertType === 'specificJsError') {
    render = renderJsErrors;
  } else if (alertType === 'statusCode') {
    render = renderStatusCode;
  } else if (alertType === 'slowness') {
    render = renderSlowness;
  } else if (alertType === 'throughput') {
    render = renderThroughput;
  } else if (alertType === 'customEvent') {
    render = renderCustomEvent;
  }
  return render?.() ?? null;
}

AlertTypeSwitch.propTypes = {
  alertType: PropTypes.string.isRequired,
  renderJsErrors: PropTypes.func,
  renderSlowness: PropTypes.func,
  renderStatusCode: PropTypes.func,
  renderThroughput: PropTypes.func,
  renderCustomEvent: PropTypes.func
};
