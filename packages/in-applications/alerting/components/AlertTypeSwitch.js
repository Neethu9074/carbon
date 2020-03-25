import PropTypes from 'prop-types';

export default function AlertTypeSwitch({ alertType, renderErrorRate, renderSlowness }) {
  if (alertType === 'errorRate') {
    return renderErrorRate();
  } else if (alertType === 'slowness') {
    return renderSlowness();
  }
}

AlertTypeSwitch.propTypes = {
  alertType: PropTypes.string.isRequired,
  renderErrorRate: PropTypes.func.isRequired,
  renderSlowness: PropTypes.func.isRequired
};
