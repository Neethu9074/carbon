/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';

/**
 * Can contain multiple applications
 */
export const applicationsItemTreePropType = PropTypes.shape({
  applicationId: PropTypes.string,
  /**
   * Can contain multiple services
   */
  services: PropTypes.shape({
    servicesId: PropTypes.shape({
      servicesId: PropTypes.string,
      /**
       * Can contain multiple endpoints
       */
      endpoints: PropTypes.shape({
        endpointId: PropTypes.shape({
          endpointId: PropTypes.string
        })
      })
    })
  })
});

export const stateManagementPropType = PropTypes.shape({
  dispatch: PropTypes.func,
  state: applicationsItemTreePropType
});
