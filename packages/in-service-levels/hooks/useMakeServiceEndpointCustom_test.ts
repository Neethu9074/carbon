/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';
import { TagFilter } from '@instana/types';

import {
  testApplicationForm,
  testApplicationFormwithoutEndpoint,
  testApplicationFormwithoutServicandEndpoint,
  testApplicationFormwithoutService
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import useMakeServiceEndpointCustom from 'in-service-levels/hooks/useMakeServiceEndpointCustom';
import getEndpointInfoOriginal from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabelOriginal from 'in-applications/subscriptions/getServiceLabel';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getServiceLabel');
const getServiceLabel = getServiceLabelOriginal as jest.MockedFunction<typeof getServiceLabelOriginal>;

jest.mock('in-applications/subscriptions/getEndpointInfo');
const getEndpointInfo = getEndpointInfoOriginal as jest.MockedFunction<typeof getEndpointInfoOriginal>;

describe('useMakeServiceEndpointCustom', () => {
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
          type: 'HTTP' as const
        })
      )
    );
  });
  it('should return correct tagFilter expression when service and endpoint names are provided', () => {
    const givenForm = testApplicationForm;
    const { result } = renderHook(() => useMakeServiceEndpointCustom(givenForm) as unknown as TagFilter);

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

  it('should return correct tagFilter expression when only service name is provided', () => {
    const givenForm = testApplicationFormwithoutService;
    const { result } = renderHook(() => useMakeServiceEndpointCustom(givenForm) as unknown as TagFilter);
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

  it('should return correct tagFilter expression when only endpoint name is provided', () => {
    const givenForm = testApplicationFormwithoutEndpoint;
    const { result } = renderHook(() => useMakeServiceEndpointCustom(givenForm) as unknown as TagFilter);
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

  it('should return correct tagFilter expression when neither service nor endpoint names are provided', () => {
    const givenForm = testApplicationFormwithoutServicandEndpoint;
    const { result } = renderHook(() => useMakeServiceEndpointCustom(givenForm) as unknown as TagFilter);
    expect(result.current).toEqual([]);
  });
});
