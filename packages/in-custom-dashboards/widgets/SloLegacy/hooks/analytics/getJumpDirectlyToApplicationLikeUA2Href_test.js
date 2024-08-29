/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { just } from '@instana/observables';

import getJumpDirectlyToApplicationLikeUA2Href$ from 'in-custom-dashboards/widgets/SloLegacy/hooks/analytics/getJumpDirectlyToApplicationLikeUA2Href';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';
import { noop } from 'in-services/util/function';

jest.mock('in-applications/subscriptions/getEndpointInfo', () => {
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just({ data: { label: undefined } }))
  };
});
jest.mock('in-applications/subscriptions/getServiceLabel', () => {
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just({ data: { label: undefined } }))
  };
});
jest.mock('in-applications/subscriptions/getApplication', () => {
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just({ data: { label: undefined } }))
  };
});

describe('in-custom-dashboards/widgets/SloLegacy/hooks/analytics/getJumpDirectlyToApplicationLikeUA2Href', () => {
  beforeEach(jest.clearAllMocks);

  it('fetches the labels for the application, service and endpoint if their ids are in the slo configuration', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      serviceId: 'someService',
      endpointId: 'someEndpoint'
    };

    // When
    getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'INBOUND', {});

    // Then
    expect(getApplication).toHaveBeenLastCalledWith({ id: 'someApplication' });
    expect(getServiceLabel).toHaveBeenLastCalledWith({ id: 'someService' });
    expect(getEndpointInfo).toHaveBeenLastCalledWith({ id: 'someEndpoint' });
  });

  it('does not fetch the application label if no applicationId is set', () => {
    // Given
    const ids = {
      serviceId: 'someService',
      endpointId: 'someEndpoint'
    };

    // When
    getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'INBOUND', {});

    // Then
    expect(getApplication).not.toHaveBeenCalled();
    expect(getServiceLabel).toHaveBeenCalled();
    expect(getEndpointInfo).toHaveBeenCalled();
  });

  it('does not fetch the service label if no service id is set', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      endpointId: 'someEndpoint'
    };

    // When
    getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'INBOUND', {});

    // Then
    expect(getApplication).toHaveBeenCalled();
    expect(getServiceLabel).not.toHaveBeenCalled();
    expect(getEndpointInfo).toHaveBeenCalled();
  });

  it('does not fetch the endpoint label if no endpoint id is set', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      serviceId: 'someService'
    };

    // When
    getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'INBOUND', {});

    // Then
    expect(getApplication).toHaveBeenCalled();
    expect(getServiceLabel).toHaveBeenCalled();
    expect(getEndpointInfo).not.toHaveBeenCalled();
  });

  it('sets a application.name tagFilter if the application label was loaded and the boundaryScope is not INBOUND', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      serviceId: 'someService',
      endpointId: 'someEndpoint'
    };
    getApplication.mockReturnValueOnce(just({ data: { label: 'Stans Lab' } }));
    const getLinkToApplicationAnalyze = jest.fn(() => '');

    // When
    const href$ = getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'ALL', {}, getLinkToApplicationAnalyze);
    href$.subscribe(noop);

    // Then
    expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formModel: expect.arrayContaining([
          tagFilter('application.name', 'EQUALS', 'Stans Lab', undefined, 'DESTINATION')
        ])
      })
    );
  });

  it('sets a call.inbound_of_application tagFilter if the application label was loaded and the boundaryScope is INBOUND', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      serviceId: 'someService',
      endpointId: 'someEndpoint'
    };
    getApplication.mockReturnValueOnce(just({ data: { label: 'Stans Lab' } }));
    const getLinkToApplicationAnalyze = jest.fn(() => '');

    // When
    const href$ = getJumpDirectlyToApplicationLikeUA2Href$(
      ids,
      undefined,
      [],
      'INBOUND',
      {},
      getLinkToApplicationAnalyze
    );
    href$.subscribe(noop);

    // Then
    expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formModel: expect.arrayContaining([
          tagFilter('call.inbound_of_application', 'EQUALS', 'Stans Lab', undefined, 'DESTINATION')
        ])
      })
    );
  });

  it('sets a service.name tagFilter if the service label was loaded', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      serviceId: 'someService',
      endpointId: 'someEndpoint'
    };
    getServiceLabel.mockReturnValueOnce(just({ data: { label: 'Snack Distribution' } }));
    const getLinkToApplicationAnalyze = jest.fn(() => '');

    // When
    const href$ = getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'ALL', {}, getLinkToApplicationAnalyze);
    href$.subscribe(noop);

    // Then
    expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formModel: expect.arrayContaining([
          tagFilter('service.name', 'EQUALS', 'Snack Distribution', undefined, 'DESTINATION')
        ])
      })
    );
  });

  it('sets a endpoint.name tagFilter if the endpoint label was loaded', () => {
    // Given
    const ids = {
      applicationId: 'someApplication',
      serviceId: 'someService',
      endpointId: 'someEndpoint'
    };
    getEndpointInfo.mockReturnValueOnce(just({ data: { label: 'distribute' } }));
    const getLinkToApplicationAnalyze = jest.fn(() => '');

    // When
    const href$ = getJumpDirectlyToApplicationLikeUA2Href$(ids, undefined, [], 'ALL', {}, getLinkToApplicationAnalyze);
    href$.subscribe(noop);

    // Then
    expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
      expect.objectContaining({
        formModel: expect.arrayContaining([
          tagFilter('endpoint.name', 'EQUALS', 'distribute', undefined, 'DESTINATION')
        ])
      })
    );
  });
});
