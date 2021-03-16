/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

export const alertsLaneAlertsPropType = PropTypes.shape({
  eventId: PropTypes.string,
  name: PropTypes.string,
  triggeringTime: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number
});
