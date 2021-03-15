/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';

export const applicationsItemTreePropType = PropTypes.shape({
  applicationId: PropTypes.string,
  services: PropTypes.shape({
    servicesId: PropTypes.shape({
      servicesId: PropTypes.string,
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
