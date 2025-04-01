/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { shallow } from 'enzyme';
import React from 'react';

import SloTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTile';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';

import locals from './SloTile.mless';

describe('in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTile', () => {
  it('renders a placeholder if value is undefined', () => {
    // Given
    const value = undefined;

    // When
    const wrapper = shallow(<SloTile title="" companionTitle="" value={value} companionValue="something" />);

    // Then
    expect(wrapper.find(`.${locals.value}`).text()).toContain(valueMissingPlaceholder);
  });

  it('applies none of the budget indicator classes to value if value is undefined', () => {
    // Given
    const value = undefined;
    const budget = 'something';
    const budgetSpent = true;

    // When
    const wrapper = shallow(
      <SloTile title="" companionTitle="" value={value} companionValue={budget} spent={budgetSpent} />
    );

    // Then
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetAvailable)).not.toBeTruthy();
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetSpent)).not.toBeTruthy();
  });

  it('applies none of the budget indicator classes to value if budget is undefined', () => {
    // Given
    const value = 'something';
    const budget = undefined;
    const budgetSpent = true;

    // When
    const wrapper = shallow(
      <SloTile title="" companionTitle="" value={value} companionValue={budget} spent={budgetSpent} />
    );

    // Then
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetAvailable)).not.toBeTruthy();
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetSpent)).not.toBeTruthy();
  });

  it('applies budgetAvailable to value if both value and budget are defined and budgetSpent is false', () => {
    // Given
    const value = '2';
    const budget = '3';
    const budgetSpent = false;

    // When
    const wrapper = shallow(
      <SloTile title="" companionTitle="" value={value} companionValue={budget} spent={budgetSpent} />
    );

    // Then
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetAvailable)).toBeTruthy();
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetSpent)).not.toBeTruthy();
  });

  it('applies budgetSpent to value if both value and budget are defined and budgetSpent is true', () => {
    // Given
    const value = '3';
    const budget = '2';
    const budgetSpent = true;

    // When
    const wrapper = shallow(
      <SloTile title="" companionTitle="" value={value} companionValue={budget} spent={budgetSpent} />
    );

    // Then
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetAvailable)).not.toBeTruthy();
    expect(wrapper.find(`.${locals.value}`).hasClass(locals.budgetSpent)).toBeTruthy();
  });

  it('renders in a compact style if compact is true', () => {
    // Given
    const compact = true;

    // When
    const wrapper = shallow(
      <SloTile title="" companionTitle="" value="something" companionValue="somethingElse" compact={compact} />
    );

    // Then
    expect(wrapper.find(`.${locals.oneRow}`).exists()).toBeTruthy();
  });
});
