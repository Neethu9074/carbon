/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import React from 'react';

import { Subject, create } from '@instana/observables';

import EndpointSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/EndpointSelectBox';
import ComboBoxInSection from 'in-components/form/ComboBoxInSection/ComboBoxInSection';
import getEndpointsOriginal from 'in-applications/subscriptions/getEndpoints';
import { pendingResult } from 'in-services/fixedObjects';
import { listSuccess } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import { Result } from 'in-types';
import { t } from 'in-i18n';

jest.mock('in-applications/subscriptions/getEndpoints');
type Wrapper = ReturnType<typeof mount>;

describe('in-custom-dashbaords/widgets/Slo/sli/EndpointSelectBox', () => {
  let getEndpoints$: Subject<Result<any>>;
  beforeEach(() => {
    jest.resetModules();
    getEndpoints$ = create();
    // @ts-expect-error
    getEndpointsOriginal.mockReturnValue(getEndpoints$);
  });
  async function emitAndUpdate(wrapper: Wrapper, result: Result<any>) {
    getEndpoints$.emit(result);
    await new Promise(process.nextTick);

    wrapper.update();
  }

  async function openSelect(wrapper: Wrapper) {
    await act(async () => {
      wrapper.find('.Select__dropdown-indicator').hostNodes().simulate('mouseDown', {
        button: 0
      });
    });
    wrapper.update();
  }
  it('should be disabled with empty applicationId', async () => {
    // When
    const wrapper = mount(
      <EndpointSelectBox applicationId="" serviceId="" boundaryScope="ALL" value={undefined} onChange={noop} />
    );
    await emitAndUpdate(wrapper, pendingResult);

    await openSelect(wrapper);

    expect(wrapper.find(ComboBoxInSection).prop('isDisabled')).toBeTruthy();
  });
  it('has exactly one option element for all endpoints initally', async () => {
    const wrapper = mount(
      <EndpointSelectBox applicationId="someApplication" serviceId="" boundaryScope="ALL" value={''} onChange={noop} />
    );

    await emitAndUpdate(wrapper, pendingResult);

    await openSelect(wrapper);

    expect(wrapper.find('.Select__option').hostNodes()).toHaveLength(1);
    expect(wrapper.find('.Select__option').hostNodes().prop('children')).toEqual(
      t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints')
    );
  });
  it('loading indicator is shown while loading', async () => {
    const wrapper = mount(
      <EndpointSelectBox applicationId="someApplication" serviceId="" boundaryScope="ALL" value={''} onChange={noop} />
    );

    await emitAndUpdate(wrapper, pendingResult);

    await openSelect(wrapper);

    expect(wrapper.find('.Select__loading-indicator').exists()).toBeTruthy();
  });
  it('propagates the value prop to the selection element', async () => {
    const value = 'checkout';
    const wrapper = mount(
      <EndpointSelectBox
        applicationId="someApplication"
        serviceId=""
        boundaryScope="ALL"
        value={value}
        onChange={noop}
      />
    );

    await emitAndUpdate(wrapper, pendingResult);

    await emitAndUpdate(wrapper, listSuccess([{ endpoint: { value, label: value } }]));

    await openSelect(wrapper);

    expect(wrapper.find(ComboBoxInSection).prop('value')).toEqual(value);
  });

  it('passes an empty string to LazyComboxInSection value prop', async () => {
    const wrapper = mount(
      <EndpointSelectBox applicationId="someApplication" serviceId="" boundaryScope="ALL" onChange={noop} />
    );

    await emitAndUpdate(wrapper, pendingResult);

    expect(wrapper.find(ComboBoxInSection).prop('value')).toEqual('');
  });
  it('passes falsy value to SelectInSections hasError prop', async () => {
    const wrapper = mount(
      <EndpointSelectBox applicationId="someApplication" serviceId="" boundaryScope="ALL" onChange={noop} />
    );

    await emitAndUpdate(wrapper, pendingResult);

    expect(wrapper.find(ComboBoxInSection).prop('hasError')).toBeFalsy();
  });

  it('renders three option elements with appropriate values and labels', async () => {
    const wrapper = mount(
      <EndpointSelectBox applicationId="someApplication" serviceId="" boundaryScope="ALL" onChange={noop} />
    );

    await emitAndUpdate(wrapper, pendingResult);

    await emitAndUpdate(
      wrapper,
      listSuccess([
        { endpoint: { id: 'checkout', label: 'Checkout' } },
        { endpoint: { id: 'tracking', label: 'Tracking' } }
      ])
    );

    await openSelect(wrapper);

    expect(wrapper.find('.Select__option').hostNodes()).toHaveLength(3);
    expect(wrapper.find('.Select__option').hostNodes().at(0).prop('children')).toEqual(
      t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints')
    );
    expect(wrapper.find('.Select__option').hostNodes().at(1).prop('children')).toEqual('Checkout');
    expect(wrapper.find('.Select__option').hostNodes().at(2).prop('children')).toEqual('Tracking');
  });

  it('indicates an error state if hasError is true', () => {
    // Given
    const hasError = true;

    // When
    const wrapper = mount(
      <EndpointSelectBox
        hasError={hasError}
        applicationId="someApplication"
        serviceId=""
        boundaryScope="ALL"
        value={undefined}
        onChange={noop}
      />
    );

    // Then
    expect(wrapper.find(ComboBoxInSection).prop('hasError')).toBeTruthy();
  });

  describe('If an endpoint has been selected', () => {
    it('fires onChange event', async () => {
      const onChangeMock = jest.fn();
      const wrapper = mount(
        <EndpointSelectBox applicationId="someApplication" serviceId="" boundaryScope="ALL" onChange={onChangeMock} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      await emitAndUpdate(
        wrapper,
        listSuccess([
          { endpoint: { id: 'checkout', label: 'Checkout' } },
          { endpoint: { id: 'tracking', label: 'Tracking' } }
        ])
      );

      await openSelect(wrapper);

      await act(async () => {
        wrapper.find('.Select__option').hostNodes().at(1).simulate('click');
      });
      wrapper.update();

      expect(onChangeMock).toBeCalledWith('checkout');
    });
  });
  it('only fetches endpoints for the provided applicationId, serviceId and boundaryScope', async () => {
    // Given
    const applicationId = 'stansLab';
    const serviceId = 'orderStatus';
    const boundaryScope = 'INBOUND';

    // When
    const wrapper = mount(
      <EndpointSelectBox
        applicationId={applicationId}
        serviceId={serviceId}
        boundaryScope={boundaryScope}
        value={undefined}
        onChange={noop}
      />
    );
    await emitAndUpdate(wrapper, pendingResult);
    await openSelect(wrapper);

    // Then
    expect(getEndpointsOriginal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({
          application: 'stansLab',
          service: 'orderStatus',
          applicationBoundaryScope: 'INBOUND'
        })
      })
    );
  });
});
