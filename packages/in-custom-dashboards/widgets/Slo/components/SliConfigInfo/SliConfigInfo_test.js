/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { SvgIcon } from '@instana/components';

import SliConfigInfo from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo';
import Tooltip from 'in-components/Tooltip';

describe('in-custom-dashboards/widgets/Slo/components/SliConfigInfo', () => {
  describe('if no sliConfig object is provided', () => {
    it('should contain nothing', () => {
      const wrapper = shallow(<SliConfigInfo />);
      expect(wrapper.find(Tooltip)).toHaveLength(0);
    });
  });
  describe('if a sliConfig without sliEntity prop is provided ', () => {
    it('should contain nothing', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliName: 'foo' }} />);
      expect(wrapper.find(Tooltip)).toHaveLength(0);
    });
  });
  describe('if sliConfig with sliEntity is provided', () => {
    it('should contain a Tooltip component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'foo' } }} />);
      expect(wrapper.find(Tooltip)).toHaveLength(1);
    });

    it('should contain a SvgIcon component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'foo' } }} />);
      expect(wrapper.find(SvgIcon)).toHaveLength(1);
    });

    it('should contain a SvgIcon component', () => {
      const wrapper = shallow(<SliConfigInfo sliConfig={{ sliEntity: { sliType: 'foo' } }} />);
      expect(wrapper.find(SvgIcon)).toHaveLength(1);
    });
  });
});
