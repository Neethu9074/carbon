/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import {
  ApplicationFilterWidgetConfigInfoItem,
  WebsiteFilterWidgetConfigInfoItem
} from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/FilterWidgetConfigInfoItem';
import SliMetricWidgetConfigInfoItem from 'in-custom-dashboards/widgets/SloLegacy/components/SliConfigInfo/SliMetricWidgetConfigInfoItem';
import WidgetConfigInfo from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo';
import SliConfigInfo from 'in-custom-dashboards/widgets/SloLegacy/components/SliConfigInfo';

describe('in-custom-dashboards/widgets/SloLegacy/components/SliConfigInfo', () => {
  describe('if no sliConfig object is provided', () => {
    it('should contain nothing', () => {
      const wrapper = shallow(<SliConfigInfo />);
      expect(wrapper.find(WidgetConfigInfo)).toHaveLength(0);
    });
  });

  describe('if a sliConfig without sliEntity prop is provided ', () => {
    it('should contain nothing', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliName: 'foo' }} />);
      expect(wrapper.find(WidgetConfigInfo)).toHaveLength(0);
    });
  });

  describe('if sliConfig with sliEntity is provided', () => {
    it('should contain a WidgetConfigInfo component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'foo' } }} />);
      expect(wrapper.find(WidgetConfigInfo)).toHaveLength(1);
    });

    it('should contain a SliMetricWidgetConfigInfoItem component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'foo' } }} />);
      expect(wrapper.find(SliMetricWidgetConfigInfoItem)).toHaveLength(1);
    });
  });

  describe('if sliConfig with sliEntity with type websiteEventBased is provided', () => {
    it('should contain a WebsiteFilterWidgetConfigInfoItem component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'websiteEventBased' } }} />);
      expect(wrapper.find(WebsiteFilterWidgetConfigInfoItem)).toHaveLength(1);
    });
  });

  describe('if sliConfig with sliEntity with type availability is provided', () => {
    it('should contain a WebsiteFilterWidgetConfigInfoItem component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'availability' } }} />);
      expect(wrapper.find(ApplicationFilterWidgetConfigInfoItem)).toHaveLength(1);
    });
  });
});
