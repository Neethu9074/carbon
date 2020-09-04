import PropTypes from 'prop-types';

export const eventDataPropType = PropTypes.arrayOf(
  PropTypes.shape({
    timestamp: PropTypes.number,
    start: PropTypes.number,
    end: PropTypes.number,
    duration: PropTypes.number,
    alerts: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.number,
        end: PropTypes.number
      })
    )
  })
);

export const potentialProblemsLaneAlertsPropType = PropTypes.shape({
  alertConfig: PropTypes.shape({
    // this object can contain multiples keys, but it's not possible to expresse this with propTypes
    keyA: PropTypes.shape({
      rule: PropTypes.shape({
        alertType: PropTypes.string,
        metricName: PropTypes.string,
        aggregation: PropTypes.string
      }),
      threshold: PropTypes.shape({
        type: PropTypes.oneOf(['staticThreshold', 'historicBaseline']),
        operator: PropTypes.string,
        value: PropTypes.number, // if type === 'staticThreshold'
        baseline: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)), // if type === 'historicBaseline'
        seasonality: PropTypes.oneOf(['DAILY', 'WEEKLY'])
      })
    })
  }),
  alertResults: eventDataPropType
});
