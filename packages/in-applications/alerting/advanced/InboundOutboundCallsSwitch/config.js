/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';

export const boundaryScopes = {
  inbound: 'INBOUND',
  all: 'ALL',

  info: {
    INBOUND: {
      text: 'Inbound Calls',
      icon: 'lib_application_boundary_inbound_calls',
      dashboard: 'Only calls that are performed by the consumers of this application.',
      overrideDefault:
        'The default scope for this application is Inbound Calls only. You can change this in Configuration.'
    },
    ALL: {
      text: 'All Calls',
      icon: 'lib_application_boundary_all_calls',
      dashboard: 'Calls performed within this application, by both consumers as well as internally.',
      overrideDefault: 'The default scope for this application is All Calls. You can change this in Configuration.'
    }
  }
};

export const boundaryScopePropType = PropTypes.oneOf(['ALL', 'INBOUND']);
