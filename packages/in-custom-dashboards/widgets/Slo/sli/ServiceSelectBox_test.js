/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { t } from '@instana/i18n-react';

import ServiceSelectBox from 'in-custom-dashboards/widgets/Slo/sli/ServiceSelectBox';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useServices from 'in-applications/hooks/useServices';

jest.mock('in-applications/hooks/useServices', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Slo/sli/ServiceSelectBox', () => {
  beforeEach(jest.clearAllMocks);

  describe('If only necessary props were passed and state of fetched services is pending', () => {
    it('has exactly one option element with an empty string as value', () => {
      // Given
      const status = 'pending';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: true }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find('option')).toHaveLength(1);
      expect(wrapper.find('option').prop('value')).toEqual('');
    });
    it('passes the appropriate text to option element', () => {
      // Given
      const status = 'pending';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: true }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find('option').prop('children')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.loading')
      );
    });
    it('passes the appropriate label to SelectInSection component', () => {
      // Given
      const status = 'pending';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: true }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find(SelectInSection).prop('label')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.service')
      );
    });
    it('disables the SelectInSection component', () => {
      // Given
      const status = 'pending';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: true }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find(SelectInSection).prop('disabled')).toBeTruthy();
    });
    it('passes an empty string to SelectInSections value prop', () => {
      // Given
      const status = 'pending';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: true }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find(SelectInSection).prop('value')).toEqual('');
    });
    it('passes falsy value to SelectInSections hasError prop', () => {
      // Given
      const status = 'pending';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: true }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find(SelectInSection).prop('hasError')).toBeFalsy();
    });
  });
  describe('If state of fetched services is resolved', () => {
    it('has an option element containing the appropriate text', () => {
      // Given
      const status = 'resolved';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: false }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find('option').prop('children')).toEqual(
        t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices')
      );
    });
    it('enables the SelectInSection component', () => {
      // Given
      const status = 'resolved';

      // When
      useServices.mockReturnValueOnce([undefined, status, [], { loading: false }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find(SelectInSection).prop('disabled')).toBeFalsy();
    });
  });
  describe('If two services were successfully fetched', () => {
    it('renders three option elements with appropriate values and labels', () => {
      // Given
      const status = 'resolved';
      const fetchedServices = [
        { service: { id: 'serviceA', label: 'Service A' } },
        { service: { id: 'serviceB', label: 'Service B' } }
      ];

      // When
      useServices.mockReturnValueOnce([{ items: fetchedServices }, status, [], { loading: false }]);
      const wrapper = shallow(<ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" />);

      // Then
      expect(wrapper.find('option')).toHaveLength(3);
      expect(
        wrapper
          .find('option')
          .at(0)
          .prop('children')
      ).toEqual(t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices'));
      expect(
        wrapper
          .find('option')
          .at(0)
          .prop('value')
      ).toEqual('');
      expect(
        wrapper
          .find('option')
          .at(1)
          .prop('children')
      ).toEqual('Service A');
      expect(
        wrapper
          .find('option')
          .at(1)
          .prop('value')
      ).toEqual('serviceA');
      expect(
        wrapper
          .find('option')
          .at(2)
          .prop('children')
      ).toEqual('Service B');
      expect(
        wrapper
          .find('option')
          .at(2)
          .prop('value')
      ).toEqual('serviceB');
    });
  });
  describe('If a service has been selected', () => {
    it('fires onChange event', () => {
      // Given
      const onChangeMock = jest.fn();
      const status = 'resolved';
      const fetchedServices = [
        { service: { id: 'serviceA', label: 'Service A' } },
        { service: { id: 'serviceB', label: 'Service B' } }
      ];

      // When
      useServices.mockReturnValueOnce([{ items: fetchedServices }, status, [], { loading: false }]);
      const wrapper = shallow(
        <ServiceSelectBox applicationId="someApplication" boundaryScope="INBOUND" onChange={onChangeMock} />
      );

      // Then
      wrapper.find(SelectInSection).simulate('change', { target: { value: 'serviceA' } });
      expect(onChangeMock).toBeCalledWith('serviceA');
    });
  });
});
