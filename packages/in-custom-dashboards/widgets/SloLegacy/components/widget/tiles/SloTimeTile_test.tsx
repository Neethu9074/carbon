/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { mount, shallow } from 'enzyme';
import React from 'react';

import SloTimeTile, {
  compactTimeInterval
} from 'in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTimeTile';

import locals from './SloTile.mless';

describe('in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTimeTile', function () {
  describe('#compactTimeInterval', function () {
    function testConversionResult(fromDate: Date, toDate: Date): string {
      const { fromStr, toStr } = compactTimeInterval(fromDate.getTime(), toDate.getTime());
      return fromStr + ' - ' + toStr;
    }

    it('produce the correct compact time formatting', function () {
      expect(
        testConversionResult(
          // < just helps code formatting
          new Date(2021, 0, 1, 1, 1, 1),
          new Date(2021, 1, 2, 2, 2, 1)
        )
      ).toEqual('Jan 01, 2021 01:01 - Feb 02, 2021 02:02');
    });
  });

  it('renders in a compact style if compact is true', () => {
    // Given
    const compact = true;

    // When
    const wrapper = shallow(<SloTimeTile title="" timeFrameLabel="" compact={compact} />);

    // Then
    expect(wrapper.find(`.${locals.oneRow}`).exists()).toBeTruthy();
  });

  it('does not render title if compact is true', () => {
    // Given
    const title = 'This should not show';
    const compact = true;

    // When
    const wrapper = shallow(<SloTimeTile title={title} timeFrameLabel="" compact={compact} />);

    // Then
    expect(wrapper.text()).not.toContain('This should not show');
  });

  it.each([[false], [true]])('renders the fromTimestamp as a well formed time element for compact = %s', compact => {
    // Given
    const fromTimestamp = 1637242868000; // Thursday, 18 November 2021 13:41:08 UTC

    // When
    const wrapper = mount(
      <SloTimeTile title="some title" timeFrameLabel="some label" fromTimestamp={fromTimestamp} compact={compact} />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(<time dateTime="2021-11-18T13:41:08.000Z">2021-11-18, 14:41:08</time>)
    ).toBeTruthy();
  });

  it.each([[false], [true]])('renders the toTimestamp as a well formed time element for compact = %s', compact => {
    // Given
    const toTimestamp = 1637242868000; // Thursday, 18 November 2021 13:41:08 UTC

    // When
    const wrapper = mount(
      <SloTimeTile title="some title" timeFrameLabel="some label" toTimestamp={toTimestamp} compact={compact} />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(<time dateTime="2021-11-18T13:41:08.000Z">2021-11-18, 14:41:08</time>)
    ).toBeTruthy();
  });

  it('renders a compact time representation if compact is true', () => {
    // Given
    const toTimestamp = 1647252868000; // Monday, 14 March 2022 10:14:28 UTC
    const fromTimestamp = 1637242868000; // Thursday, 18 November 2021 13:41:08 UTC
    const compact = true;

    // When
    const wrapper = mount(
      <SloTimeTile
        title="some title"
        timeFrameLabel="some label"
        fromTimestamp={fromTimestamp}
        toTimestamp={toTimestamp}
        compact={compact}
      />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(<time dateTime="2021-11-18T13:41:08.000Z">Nov 18, 2021 14:41</time>)
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(<time dateTime="2022-03-14T10:14:28.000Z">Mar 14, 2022 11:14</time>)
    ).toBeTruthy();
  });
});
