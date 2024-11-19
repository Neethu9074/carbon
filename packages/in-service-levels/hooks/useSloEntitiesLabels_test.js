/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { finishedProgress, pendingResult } from 'in-services/fixedObjects';
import getApplication from 'in-applications/subscriptions/getApplication';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getApplication');
jest.mock('in-websites/subscriptions/getWebsite');

describe('in-service-levels/hooks/useSloEntitiesLabels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getApplication.mockReturnValue(just(pendingResult));
    getWebsite.mockReturnValue(just(pendingResult));
  });

  it('fetches application entities if entityType is application', () => {
    // Given
    const configurations = [{ id: 'snack slo', entity: { type: 'application', applicationId: 'Snack Vending Id' } }];
    const mockObservable = just(success({ label: 'Snack Vending Application Label' }));
    getApplication.mockReturnValue(mockObservable);

    // When
    const {
      result: { current }
    } = renderHook(() => useSloEntitiesLabels(configurations));
    const [labels, status] = current;

    // Then
    expect(getApplication).toHaveBeenCalledWith({ id: 'Snack Vending Id' });
    expect(status).toEqual('resolved');
    expect(labels).toEqual(
      expect.objectContaining({
        'snack slo': expect.arrayContaining([expect.objectContaining({ label: 'Snack Vending Application Label' })])
      })
    );
  });

  it('fetches website entities if entityType is website', () => {
    // Given
    const configurations = [{ id: 'snack blog slo', entity: { type: 'website', websiteId: 'Snack Blog Id' } }];
    const mockObservable = just(success({ label: 'Snack Blog Website Label' }));
    getWebsite.mockReturnValue(mockObservable);

    // When
    const {
      result: { current }
    } = renderHook(() => useSloEntitiesLabels(configurations));
    const [labels, status] = current;

    // Then
    expect(getWebsite).toHaveBeenCalledWith({ id: 'Snack Blog Id' });
    expect(status).toEqual('resolved');
    expect(labels).toEqual(
      expect.objectContaining({
        'snack blog slo': expect.arrayContaining([expect.objectContaining({ label: 'Snack Blog Website Label' })])
      })
    );
  });

  it('handles loading from both application and website data if mixed entityTypes are provided', () => {
    // Given
    const configurations = [
      { id: 'snack slo', entity: { type: 'application', applicationId: 'Snack Vending Id' } },
      { id: 'snack blog slo', entity: { type: 'website', websiteId: 'Snack Blog Id' } }
    ];
    getApplication.mockReturnValue(just(success({ label: 'Snack Vending Application Label' })));
    getWebsite.mockReturnValue(just(success({ label: 'Snack Blog Website Label' })));

    // When
    const {
      result: { current }
    } = renderHook(() => useSloEntitiesLabels(configurations));
    const [labels, status] = current;

    // Then
    expect(getApplication).toHaveBeenCalledWith({ id: 'Snack Vending Id' });
    expect(getWebsite).toHaveBeenCalledWith({ id: 'Snack Blog Id' });
    expect(status).toEqual('resolved');
    expect(labels).toEqual(
      expect.objectContaining({
        'snack slo': expect.arrayContaining([expect.objectContaining({ label: 'Snack Vending Application Label' })]),
        'snack blog slo': expect.arrayContaining([expect.objectContaining({ label: 'Snack Blog Website Label' })])
      })
    );
  });

  it('if multiple configurations are provided the returned progress reflects all subscriptions', () => {
    // Given
    const configurations = [
      { id: 'snack slo', entity: { type: 'application', applicationId: 'Snack Vending Id' } },
      { id: 'snack blog slo', entity: { type: 'website', websiteId: 'Snack Blog Id' } }
    ];
    getApplication.mockReturnValue(just(success({ label: 'Snack Vending Application Label' })));
    getWebsite.mockReturnValue(just(pendingResult));

    // When
    const {
      result: { current }
    } = renderHook(() => useSloEntitiesLabels(configurations));
    const [, status, , progress] = current;

    // Then
    expect(status).toEqual('pending');
    expect(progress).toEqual(expect.objectContaining({ loading: true }));
  });

  it('if multiple configurations are provided the returned errors reflect all subscriptions', () => {
    // Given
    const configurations = [
      { id: 'snack slo', entity: { type: 'application', applicationId: 'Snack Vending Id' } },
      { id: 'snack blog slo', entity: { type: 'website', websiteId: 'Snack Blog Id' } }
    ];
    getApplication.mockReturnValue(just({ progress: finishedProgress, errors: ['The application was not found'] }));
    getWebsite.mockReturnValue(just({ progress: finishedProgress, errors: ['The website was not found'] }));

    // When
    const {
      result: { current }
    } = renderHook(() => useSloEntitiesLabels(configurations));
    const [, status, errors] = current;

    // Then
    expect(status).toEqual('rejected');
    expect(errors).toEqual(expect.arrayContaining(['The application was not found', 'The website was not found']));
  });
});
