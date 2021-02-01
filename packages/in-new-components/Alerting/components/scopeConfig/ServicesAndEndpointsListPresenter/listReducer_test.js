/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { listReducer, actionType } from './listReducer';

const applicationId = 'abc-123';
const serviceId = 'def-456';
const endpointId = 'ghi-789';

describe('in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/listReducer', () => {
  it('should add an application', () => {
    const state = {};
    const newState = listReducer(state, { type: actionType.ADD_APPLICATION, applicationId });
    expect(newState).to.have.own.property(applicationId);
  });

  it('should add a service to an existing application', () => {
    const state = createState(applicationId, serviceId);
    const newState = listReducer(state, { type: actionType.ADD_SERVICE, applicationId, serviceId });
    expect(newState).to.have.nested.property(`${applicationId}.services.${serviceId}`);
  });

  it('should add a service and an application if parent application is not added yet', () => {
    const state = {};
    const newState = listReducer(state, { type: actionType.ADD_SERVICE, applicationId, serviceId });
    expect(newState).to.have.nested.property(`${applicationId}.services.${serviceId}`);
  });

  it('should add an endpoint to an existing service nested in an existing application', () => {
    const state = createState(applicationId, serviceId, endpointId);
    const newState = listReducer(state, { type: actionType.ADD_ENDPOINT, applicationId, serviceId, endpointId });
    expect(newState).to.have.nested.property(`${applicationId}.services.${serviceId}.endpoints.${endpointId}`);
  });

  it('should add an endpoint and a service and an application if parent service and application are not added yet', () => {
    const state = {};
    const newState = listReducer(state, { type: actionType.ADD_ENDPOINT, applicationId, serviceId, endpointId });
    expect(newState).to.have.nested.property(`${applicationId}.services.${serviceId}.endpoints.${endpointId}`);
  });

  // it('should remove an application', () => {
  //   const state = createState(applicationId);
  //   const newState = listReducer(state, { type: actionType.REMOVE_APPLICATION, applicationId });
  //   expect(newState).to.not.have.own.property(applicationId);
  // });

  // it('should remove a service', () => {
  //   const state = createState(applicationId, serviceId);
  //   const newState = listReducer(state, { type: actionType.REMOVE_SERVICE, applicationId, serviceId });
  //   expect(newState).to.not.have.nested.property(`${applicationId}.services.${serviceId}`);
  // });

  // it('should remove an endpoint', () => {
  //   const state = createState(applicationId, serviceId, endpointId);
  //   const newState = listReducer(state, { type: actionType.REMOVE_ENDPOINT, applicationId, serviceId, endpointId });
  //   expect(newState).to.not.have.nested.property(`${applicationId}.services.${serviceId}.endpoints.${endpointId}`);
  // });
});

function createState(applicationId, serviceId, endpointId) {
  const state = { [applicationId]: { applicationId, services: {} } };
  if (serviceId != null) {
    state[applicationId].services[serviceId] = { serviceId, endpoints: {} };
  }
  if (endpointId != null) {
    state[applicationId].services[serviceId].endpoints[endpointId] = { endpointId };
  }
  return state;
}
