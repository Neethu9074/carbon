/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { mount } from 'enzyme';
import React from 'react';

// @ts-expect-error missing ts-migration
import { CarbonSideNavigationPane } from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent';

describe('in-components/layout/SideNavigationAndContent', () => {
  it('should render two pages', () => {
    const testString = 'this is the title';
    const tree = [
      {
        title: 'abc',
        pages: [
          {
            icon: 'lib_actions_async',
            subPages: [],
            path: 'first',
            label: testString
          },
          {
            subPages: [],
            path: 'second',
            label: 'def two'
          }
        ]
      }
    ];
    const wrapper = mount(<CarbonSideNavigationPane navigationTree={tree} />);
    // Two links total
    expect(wrapper.find('.cds--side-nav__link-text').length).toBe(2);
    // First link has correct label
    expect(wrapper.find('.cds--side-nav__link-text').first().text()).toBe(testString);
  });
  it('should use renderLabel when label is undefined', () => {
    const testString = 'from_func';
    const tree = [
      {
        title: 'abc',
        pages: [
          {
            icon: 'lib_actions_async',
            subPages: [],
            path: '',
            renderLabel: () => testString
          }
        ]
      }
    ];
    const wrapper = mount(<CarbonSideNavigationPane navigationTree={tree} />);
    // renderLabel returns correct string
    expect(wrapper.find('.cds--side-nav__link-text').text()).toBe(testString);
  });
});
