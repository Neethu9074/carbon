/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';
import { createField, createMapForm } from 'formalistic';

import { just } from '@instana/observables';

import useMergedServiceEndpointCustomFilters from 'in-service-levels/hooks/useMergedServiceEndpointCustomFilters';
import { testApplicationForm } from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getServiceLabel', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('in-applications/subscriptions/getEndpointInfo', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('useMergedServiceEndpointCustomFilters', () => {
  beforeAll(() => {
    getServiceLabel.mockReturnValue(
      just(
        success({
          label: 'Shopping cart',
          id: 'shoppingCartId'
        })
      )
    );
    getEndpointInfo.mockReturnValue(
      just(
        success({
          id: 'purchaseSnackId',
          label: 'Purchase snack',
          serviceId: 'shoppingCartId',
          technologies: [],
          type: 'HTTP'
        })
      )
    );
  });
  it('should return configured service and endpoint expression when service and endpoint names are provided', () => {
    const givenForm = testApplicationForm;
    const { result } = renderHook(() => useMergedServiceEndpointCustomFilters(givenForm));
    getServiceLabel.mockReturnValue(
      just(
        success({
          label: 'Shopping cart',
          id: 'shoppingCartId'
        })
      )
    );
    getEndpointInfo.mockReturnValue(
      just(
        success({
          id: 'purchaseSnackId',
          label: 'Purchase snack',
          serviceId: 'shoppingCartId',
          technologies: [],
          type: 'HTTP'
        })
      )
    );
    expect(result.current).toEqual([
      {
        entity: 'NOT_APPLICABLE',
        key: 'DESTINATION',
        name: 'service.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Shopping cart'
      },
      {
        logicalOperator: 'AND',
        type: 'CONJUNCTION'
      },
      {
        entity: 'NOT_APPLICABLE',
        key: 'DESTINATION',
        name: 'endpoint.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Purchase snack'
      }
    ]);
  });

  it('should return correct configured service expression when only service name is provided', () => {
    const givenForm = createMapForm({
      items: {
        scope: createMapForm({
          items: {
            endpointId: createField({ value: '' }),
            serviceId: createField({ value: 'withserviceID' }),
            tagFilterExpression: createField({ value: fromBackendModel(undefined) })
          }
        })
      }
    });
    const { result } = renderHook(() => useMergedServiceEndpointCustomFilters(givenForm));
    expect(result.current).toEqual([
      {
        entity: 'NOT_APPLICABLE',
        key: 'DESTINATION',
        name: 'service.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Shopping cart'
      }
    ]);
  });

  it('should return correct configured endpoint expression when only endpoint name is provided', () => {
    const givenForm = createMapForm({
      items: {
        scope: createMapForm({
          items: {
            endpointId: createField({ value: 'endpoindNotEmpty' }),
            serviceId: createField({ value: '' }),
            tagFilterExpression: createField({ value: fromBackendModel(undefined) })
          }
        })
      }
    });
    const { result } = renderHook(() => useMergedServiceEndpointCustomFilters(givenForm));
    expect(result.current).toEqual([
      {
        entity: 'NOT_APPLICABLE',
        key: 'DESTINATION',
        name: 'endpoint.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Purchase snack'
      }
    ]);
  });

  it('should return empty expression when neither service nor endpoint names are provided', () => {
    const givenForm = createMapForm({
      items: {
        scope: createMapForm({
          items: {
            endpointId: createField({ value: '' }),
            serviceId: createField({ value: '' }),
            tagFilterExpression: createField({ value: fromBackendModel(undefined) })
          }
        })
      }
    });
    const { result } = renderHook(() => useMergedServiceEndpointCustomFilters(givenForm));
    expect(result.current).toEqual([]);
  });
});
