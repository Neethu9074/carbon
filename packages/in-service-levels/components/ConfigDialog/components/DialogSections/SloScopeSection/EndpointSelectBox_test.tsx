/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shallow } from 'enzyme';
import React from 'react';

import EndpointSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/EndpointSelectBox';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { EndpointItem, PaginatedResult } from 'in-types';
import uE from 'in-applications/hooks/useEndpoints';
import { FetchedState } from 'in-hooks/utils/types';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

const useEndpoints = uE as jest.MockedFunction<typeof uE>;

jest.mock('in-applications/hooks/useEndpoints', () => ({
  __esModule: true,
  default: jest.fn(() => [undefined, 'pending', []])
}));

describe('in-custom-dashbaords/widgets/Slo/sli/EndpointSelectBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useEndpoints.mockReturnValue([undefined, 'pending', [], { loading: false }]);
  });

  it('renders a loading indicator while endpoints are being loaded', () => {
    // Given
    useEndpoints.mockReturnValue([undefined, 'pending', [], { loading: false }]);

    // When
    const wrapper = shallow(
      <EndpointSelectBox applicationId="" serviceId="" boundaryScope="ALL" value={undefined} onChange={noop} />
    );

    // Then
    expect(wrapper.text()).toContain(t('in-custom-dashboards:widgets.slo.endpointSelectBox.loading'));
  });

  it.each([['pending'], ['rejected']])('disables the selection if the endpoint result is %s', status => {
    // Given
    useEndpoints.mockReturnValue([undefined, status, [], { loading: false }] as FetchedState<
      PaginatedResult<EndpointItem>
    >);

    // When
    const wrapper = shallow(
      <EndpointSelectBox applicationId="" serviceId="" boundaryScope="ALL" value={undefined} onChange={noop} />
    );

    // Then
    expect(wrapper.find(SelectInSection).prop('disabled')).toBeTruthy();
  });

  it('propagates the value prop to the selection element', () => {
    // Given
    const value = 'checkout';
    useEndpoints.mockReturnValue([
      {
        items: [{ endpoint: { id: 'checkout', label: 'Checkout' } }],
        page: 1,
        pageSize: 1,
        totalHits: 1
      } as PaginatedResult<EndpointItem>,
      'resolved',
      [],
      { loading: false }
    ]);

    // When
    const wrapper = shallow(
      <EndpointSelectBox applicationId="" serviceId="" boundaryScope="ALL" value={value} onChange={noop} />
    );

    expect(wrapper.find(SelectInSection).prop('value')).toEqual(value);
  });

  it.each([[undefined], [null], ['']])(
    'indicates all endpoints are being selected if value is %s and endpoints are resolved',
    value => {
      // Given
      useEndpoints.mockReturnValue([
        { items: [], page: 1, pageSize: 0, totalHits: 0 } as PaginatedResult<EndpointItem>,
        'resolved',
        [],
        { loading: false }
      ]);

      // When
      const wrapper = shallow(
        <EndpointSelectBox applicationId="" serviceId="" boundaryScope="ALL" value={value} onChange={noop} />
      );

      // Then
      expect(
        wrapper.containsMatchingElement(
          <option>{t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints')}</option>
        )
      ).toBeTruthy();
    }
  );

  it('renders options for all resolved endpoints', () => {
    // Given
    useEndpoints.mockReturnValue([
      {
        items: [
          { endpoint: { id: 'checkout', label: 'Checkout' } },
          { endpoint: { id: 'tracking', label: 'Tracking' } },
          { endpoint: { id: 'signUp', label: 'SignUp' } }
        ],
        page: 1,
        pageSize: 3,
        totalHits: 3
      } as PaginatedResult<EndpointItem>,
      'resolved',
      [],
      { loading: false }
    ]);

    // When
    const wrapper = shallow(
      <EndpointSelectBox applicationId="" serviceId="" boundaryScope="ALL" value={undefined} onChange={noop} />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(
        <option>{t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints')}</option>
      )
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(
        <option value="checkout" key="checkout">
          Checkout
        </option>
      )
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(
        <option value="tracking" key="tracking">
          Tracking
        </option>
      )
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(
        <option value="signUp" key="signUp">
          SignUp
        </option>
      )
    ).toBeTruthy();
  });

  it('only fetches endpoints for the provided applicationId, serviceId and boundaryScope', () => {
    // Given
    const applicationId = 'stansLab';
    const serviceId = 'orderStatus';
    const boundaryScope = 'INBOUND';

    // When
    shallow(
      <EndpointSelectBox
        applicationId={applicationId}
        serviceId={serviceId}
        boundaryScope={boundaryScope}
        value={undefined}
        onChange={noop}
      />
    );

    // Then
    expect(useEndpoints).toHaveBeenLastCalledWith(
      expect.objectContaining({
        application: 'stansLab',
        service: 'orderStatus',
        filter: expect.objectContaining({
          applicationBoundaryScope: 'INBOUND'
        })
      })
    );
  });

  it('indicates an error state if hasError is true', () => {
    // Given
    const hasError = true;

    // When
    const wrapper = shallow(
      <EndpointSelectBox
        hasError={hasError}
        applicationId=""
        serviceId=""
        boundaryScope="ALL"
        value={undefined}
        onChange={noop}
      />
    );

    // Then
    expect(wrapper.find(SelectInSection).prop('hasError')).toBeTruthy();
  });

  it('calls the onChange handler with the selected endpointId when a selection is made', () => {
    // Given
    const onChange = jest.fn();

    // When
    const wrapper = shallow(
      <EndpointSelectBox onChange={onChange} applicationId="" serviceId="" boundaryScope="ALL" value={undefined} />
    );
    wrapper.find(SelectInSection).simulate('change', { target: { value: 'awesomeNewEndpoint' } });

    // Then
    expect(onChange).toHaveBeenLastCalledWith('awesomeNewEndpoint');
  });
});
