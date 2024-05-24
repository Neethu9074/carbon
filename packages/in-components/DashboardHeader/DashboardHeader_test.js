/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shallow } from 'enzyme';
import React from 'react';

import { LoadingSkeleton, SvgIcon } from '@instana/components';

import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { pendingResult } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { success } from 'in-services/util/result';

import locals from 'in-components/DashboardHeader/DashboardHeader.mless';

describe('in-components/DashboardHeader/DashboardHeader', () => {
  beforeEach(jest.clearAllMocks);
  test('displays no loading state when result is undefined', () => {
    // GIVEN
    const result = undefined;

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} />);

    // THEN
    expect(wrapper.containsMatchingElement(<LoadingSkeleton className={locals.labelSkeleton} />)).not.toBeTruthy();
  });

  test('displays skeleton label when result is pending', () => {
    // GIVEN
    const result = pendingResult;

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} />);

    // THEN
    expect(wrapper.containsMatchingElement(<LoadingSkeleton className={locals.labelSkeleton} />)).toBe(true);
  });

  test('displays skeleton button when result is pending and renderButtonLine is defined', () => {
    // GIVEN
    const result = pendingResult;
    const renderButtonLine = jest.fn();

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} renderButtonLine={renderButtonLine} />);

    // THEN
    const buttonLine = wrapper.find(`div.${locals.buttonLine}`);

    expect(buttonLine.containsMatchingElement(<LoadingSkeleton className={locals.buttonSkeleton} />)).toBeTruthy();
  });

  test('displays skeleton button when result is pending and renderMetaInformation is defined', () => {
    // GIVEN
    const result = pendingResult;
    const renderMetaInformation = jest.fn();

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} renderMetaInformation={renderMetaInformation} />);

    // THEN
    const leftContent = wrapper.find(`div.${locals.leftContent}`);

    expect(leftContent.containsMatchingElement(<LoadingSkeleton className={locals.buttonSkeleton} />)).toBeTruthy();
  });

  test('displays skeleton button when result is pending and renderTopLevelButtonLine is defined', () => {
    // GIVEN
    const result = pendingResult;
    const renderTopLevelButtonLine = jest.fn();

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} renderTopLevelButtonLine={renderTopLevelButtonLine} />);

    // THEN
    const rightContent = wrapper.find(`div.${locals.rightContent}`);

    expect(rightContent.containsMatchingElement(<LoadingSkeleton className={locals.buttonSkeleton} />)).toBeTruthy();
  });

  test('displays skeleton when result is pending and the icon property is undefined', () => {
    // GIVEN
    const result = pendingResult;
    const icon = undefined;

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} icon={icon} />);

    // THEN
    const leftContent = wrapper.find(`div.${locals.leftContent}`);
    expect(leftContent.containsMatchingElement(<LoadingSkeleton className={locals.iconSkeleton} />)).toBeTruthy();
  });

  test('displays skeleton when result is pending, the icon property is not nullish and the renderIcon property is defined', () => {
    // GIVEN
    const result = pendingResult;
    const icon = 'some_icon';
    const renderIcon = jest.fn();

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} icon={icon} renderIcon={renderIcon} />);

    // THEN
    const leftContent = wrapper.find(`div.${locals.leftContent}`);
    expect(leftContent.containsMatchingElement(<LoadingSkeleton className={locals.iconSkeleton} />)).toBeTruthy();
  });

  test('renders an icon using the passed renderIcon render function when result is not pending', () => {
    // GIVEN
    const result = success({});
    const renderIcon = jest.fn();

    // WHEN
    shallow(<DashboardHeader result={result} renderIcon={renderIcon} />);

    // THEN
    expect(renderIcon).toHaveBeenCalledTimes(1);
  });

  test('renders an SvgIcon using the provided type when result is not pending and renderIcon is undefined', () => {
    // GIVEN
    const result = success({});
    const icon = 'some_icon';

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} icon={icon} />);

    // THEN
    const leftContent = wrapper.find(`div.${locals.leftContent}`);
    expect(leftContent.containsMatchingElement(<SvgIcon type={icon} />)).toBeTruthy();
  });

  test('wraps a tooltip around string labels', () => {
    // GIVEN
    const result = success({});
    const label = 'test_label';

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} label={label} />);

    // THEN
    expect(
      wrapper.containsMatchingElement(
        <Tooltip content={label}>
          <h1 className={locals.label}>{label}</h1>
        </Tooltip>
      )
    ).toBeTruthy();
  });

  test('renders non-string labels without wrapping tooltip', () => {
    // GIVEN
    const result = success({});
    const label = <span>{'test_label'}</span>;

    // WHEN
    const wrapper = shallow(<DashboardHeader result={result} label={label} />);

    // THEN
    const leftContent = wrapper.find(`div.${locals.leftContent}`);
    expect(
      leftContent.containsMatchingElement(
        <Tooltip content={label}>
          <h1 className={locals.label}>{label}</h1>
        </Tooltip>
      )
    ).not.toBeTruthy();
  });
});
