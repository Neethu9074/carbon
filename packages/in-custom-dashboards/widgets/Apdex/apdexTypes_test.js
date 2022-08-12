/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

describe('in-custom-dashboards/widgets/Apdex/apdexTypes', () => {
  beforeEach(jest.resetModules);

  it.each([true, false])('includes application in the AvailableEntityTypes if applicaitonApdexEnabled is %s', flag => {
    // Given
    jest.doMock('in-services/featureFlags', () => ({
      applicationApdexEnabled: flag
    }));

    // When
    const { AvailableEntityTypes } = require('in-custom-dashboards/widgets/Apdex/apdexTypes');

    // Then
    expect(AvailableEntityTypes.includes('application')).toEqual(flag);
  });
});
