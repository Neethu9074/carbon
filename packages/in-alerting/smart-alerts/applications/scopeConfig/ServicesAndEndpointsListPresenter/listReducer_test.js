/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import {
  listReducer,
  actionType
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';

const applicationId = 'abc-123';
const serviceId = 'def-456';
const endpointId = 'ghi-789';

describe('in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/listReducer', () => {
  it('should add an application', () => {
    const state = createState();
    const userSelectionModel = listReducer(state, { type: actionType.ADD_APPLICATION, applicationId });
    expect(userSelectionModel).to.have.own.property(applicationId);
  });

  it('should add a service to an existing application', () => {
    const state = createState(applicationId, serviceId);
    const userSelectionModel = listReducer(state, { type: actionType.ADD_SERVICE, applicationId, serviceId });
    expect(userSelectionModel).to.have.nested.property(`${applicationId}.services.${serviceId}`);
  });

  it('should add a service and an application if parent application is not added yet', () => {
    const state = createState();
    const userSelectionModel = listReducer(state, { type: actionType.ADD_SERVICE, applicationId, serviceId });
    expect(userSelectionModel).to.have.nested.property(`${applicationId}.services.${serviceId}`);
  });

  it('should add an endpoint to an existing service nested in an existing application', () => {
    const state = createState(applicationId, serviceId, endpointId);
    const userSelectionModel = listReducer(state, {
      type: actionType.ADD_ENDPOINT,
      applicationId,
      serviceId,
      endpointId
    });
    expect(userSelectionModel).to.have.nested.property(
      `${applicationId}.services.${serviceId}.endpoints.${endpointId}`
    );
  });

  it('should add an endpoint and a service and an application if parent service and application are not added yet', () => {
    const state = createState();
    const userSelectionModel = listReducer(state, {
      type: actionType.ADD_ENDPOINT,
      applicationId,
      serviceId,
      endpointId
    });
    expect(userSelectionModel).to.have.nested.property(
      `${applicationId}.services.${serviceId}.endpoints.${endpointId}`
    );
  });

  it('should remove an application', () => {
    const state = createState(applicationId);
    const userSelectionModel = listReducer(state, { type: actionType.REMOVE_APPLICATION, applicationId });
    expect(userSelectionModel).to.not.have.own.property(applicationId);
  });

  it('should remove a service', () => {
    const state = createState(applicationId, serviceId);
    const userSelectionModel = listReducer(state, { type: actionType.REMOVE_SERVICE, applicationId, serviceId });
    expect(userSelectionModel).to.not.have.nested.property(`${applicationId}.services.${serviceId}`);
  });

  it('should remove an endpoint', () => {
    const state = createState(applicationId, serviceId, endpointId);
    const userSelectionModel = listReducer(state, {
      type: actionType.REMOVE_ENDPOINT,
      applicationId,
      serviceId,
      endpointId
    });
    expect(userSelectionModel).to.not.have.nested.property(
      `${applicationId}.services.${serviceId}.endpoints.${endpointId}`
    );
  });
});

function createState(applicationId, serviceId, endpointId) {
  const state = {};

  if (applicationId != null) {
    state[applicationId] = { applicationId, services: {} };
  }
  if (serviceId != null) {
    state[applicationId].services[serviceId] = { serviceId, endpoints: {} };
  }
  if (endpointId != null) {
    state[applicationId].services[serviceId].endpoints[endpointId] = { endpointId };
  }

  return state;
}
