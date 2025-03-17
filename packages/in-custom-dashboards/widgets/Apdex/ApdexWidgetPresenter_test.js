/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import useApdexWidgetTimeConfig from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetTimeConfig';
import useMonitoredEntity from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity';
import ApdexWidgetPresenter from 'in-custom-dashboards/widgets/Apdex/ApdexWidgetPresenter';
import useApdexMetrics from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics';
import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { hours, minutes } from 'in-services/time';

jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetTimeConfig', () => ({
  __esModule: true,
  default: jest.fn(() => {})
}));
jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity', () => {
  const { resultToFetchedStateResponse } = jest.requireActual('in-hooks/utils/resultToFetchedStateResponse');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    __esModule: true,
    default: jest.fn(() => resultToFetchedStateResponse(success({})))
  };
});
jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics', () => {
  const { resultToFetchedStateResponse } = jest.requireActual('in-hooks/utils/resultToFetchedStateResponse');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    __esModule: true,
    default: jest.fn(() => resultToFetchedStateResponse(success({})))
  };
});
jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useApdexConfiguration', () => {
  const { resultToFetchedStateResponse } = jest.requireActual('in-hooks/utils/resultToFetchedStateResponse');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    __esModule: true,
    default: jest.fn(() => resultToFetchedStateResponse(success({})))
  };
});
jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useTagCatalogLoader');
jest.mock('in-applications/hooks/useTagCatalog');

jest.mock('in-services/featureFlags', () => ({
  sloFullEnabled: true
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: cb => cb()
}));

describe('in-custom-dashboards/widgets/Apdex', () => {
  it('applies the adjustedTimeframe from the apdex metric subscription to the timeConfig passed to the ApdexWidget if it was provided', () => {
    // Given

    useApdexWidgetTimeConfig.mockReturnValueOnce({
      windowSize: hours.toMillis(2),
      autoRefresh: false
    });
    useMonitoredEntity.mockReturnValueOnce([{ label: 'Stans Lab' }, undefined, undefined, { loading: false }]);
    useApdexMetrics.mockReturnValueOnce([
      [
        {
          adjustedTimeframe: { to: hours.toMillis(1), windowSize: hours.toMillis(1) },
          id: 'apdex',
          values: []
        }
      ],
      undefined,
      [],
      { loading: false }
    ]);

    // When
    const wrapper = shallow(<ApdexWidgetPresenter actions={undefined} config={{}} title="" dragHandle={undefined} />)
      // Render two levels because we have a wrapping component to handle conditionally rendering based on a feature flag
      .first()
      .shallow();

    // Then
    expect(wrapper.find(ApdexWidget).prop('timeConfig')).toEqual(
      expect.objectContaining({
        windowSize: hours.toMillis(1),
        to: hours.toMillis(1)
      })
    );
  });

  it('passes the granularity from the apdex metric subscription to the ApdexWidget if it was provided', () => {
    // Given
    useApdexMetrics.mockReturnValueOnce([
      [
        {
          id: 'apdex',
          granularity: minutes.toMillis(1),
          values: []
        }
      ],
      undefined,
      [],
      { loading: false }
    ]);

    // When
    const wrapper = shallow(<ApdexWidgetPresenter actions={undefined} config={{}} title="" dragHandle={undefined} />)
      // Render two levels because we have a wrapping component to handle conditionally rendering based on a FF
      .first()
      .shallow();
    // Then
    expect(wrapper.find(ApdexWidget).prop('granularity')).toEqual(minutes.toMillis(1));
  });

  it('does not render anything if the sloFullEnabled featureFlag is not set', async () => {
    // Given
    jest.resetModules();
    jest.doMock('in-services/featureFlags', () => ({
      sloFullEnabled: false
    }));
    const { default: WidgetPresenter } = await import('in-custom-dashboards/widgets/Apdex/ApdexWidgetPresenter');

    // When
    // We only render the first level because the conditional rendering based on the feature flag is at the wrapping component level
    const wrapper = shallow(<WidgetPresenter actions={undefined} config={{}} title="" dragHandle={undefined} />);

    // Then
    expect(wrapper.find(ApdexWidget).exists()).not.toBeTruthy();
  });
});
