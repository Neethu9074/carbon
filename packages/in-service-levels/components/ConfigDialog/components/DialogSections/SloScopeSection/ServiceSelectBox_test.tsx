/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import React from 'react';

import { Subject, create } from '@instana/observables';
import { Result, ServiceItem } from '@instana/types';
import { t } from '@instana/i18n-react';

import ServiceSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ServiceSelectBox';
import ComboBoxInSection from 'in-components/form/ComboBoxInSection/ComboBoxInSection';
import getServicesOriginal from 'in-applications/subscriptions/getServices';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { listSuccess } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getServices');

const serviceA: ServiceItem = {
  service: { id: 'serviceA', label: 'Service A', snapshotIds: [], technologies: [], types: [] },
  metrics: {}
};
const serviceB: ServiceItem = {
  service: { id: 'serviceB', label: 'Service B', snapshotIds: [], technologies: [], types: [] },
  metrics: {}
};

type Wrapper = ReturnType<typeof mount>;
describe('in-custom-dashboards/widgets/SloLegacy/sli/ServiceSelectBox', () => {
  let getServices$: Subject<Result<any>>;
  beforeEach(() => {
    jest.resetModules();
    getServices$ = create();
    // @ts-expect-error
    getServicesOriginal.mockReturnValue(getServices$);
  });

  async function emitAndUpdate(wrapper: Wrapper, result: Result<any>) {
    getServices$.emit(result);
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

  describe('If only necessary props were passed and state of fetched services is pending', () => {
    it('has exactly one option element for all services initally', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      await openSelect(wrapper);

      expect(wrapper.find('.Select__option').hostNodes()).toHaveLength(1);
      expect(wrapper.find('.Select__option').hostNodes().prop('children')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices')
      );
    });
    it('loading indicator is shown while loading', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      await openSelect(wrapper);

      expect(wrapper.find('.Select__loading-indicator').exists()).toBeTruthy();
    });
    it('passes the appropriate label to SelectInSection component', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      expect(wrapper.find(ComboBoxInSection).prop('label')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.service')
      );
    });

    it('passes an empty string to SelectInSections value prop', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      expect(wrapper.find(ComboBoxInSection).prop('value')).toEqual('');
    });
    it('passes falsy value to SelectInSections hasError prop', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      expect(wrapper.find(ComboBoxInSection).prop('hasError')).toBeFalsy();
    });
  });
  describe('If state of fetched services is resolved', () => {
    it('has an option element containing the appropriate text', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      await emitAndUpdate(wrapper, listSuccess([serviceA]));

      await openSelect(wrapper);

      expect(wrapper.find('.Select__option').hostNodes().at(0).prop('children')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices')
      );
      expect(wrapper.find('.Select__option').hostNodes().at(1).prop('children')).toEqual('Service A');
    });
  });
  describe('If two services were successfully fetched', () => {
    it('renders three option elements with appropriate values and labels', async () => {
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={noop} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      await emitAndUpdate(wrapper, listSuccess([serviceA, serviceB]));

      await openSelect(wrapper);

      expect(wrapper.find('.Select__option').hostNodes()).toHaveLength(3);
      expect(wrapper.find('.Select__option').hostNodes().at(0).prop('children')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices')
      );
      expect(wrapper.find('.Select__option').hostNodes().at(1).prop('children')).toEqual('Service A');
      expect(wrapper.find('.Select__option').hostNodes().at(2).prop('children')).toEqual('Service B');
    });
  });
  describe('If a service has been selected', () => {
    it('fires onChange event', async () => {
      const onChangeMock = jest.fn();
      const wrapper = mount(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={onChangeMock} />
      );

      await emitAndUpdate(wrapper, pendingResult);

      await emitAndUpdate(wrapper, listSuccess([serviceA, serviceB]));

      await openSelect(wrapper);

      await act(async () => {
        wrapper.find('.Select__option').hostNodes().at(1).simulate('click');
      });
      wrapper.update();

      expect(onChangeMock).toBeCalledWith('serviceA');
    });
  });
});
