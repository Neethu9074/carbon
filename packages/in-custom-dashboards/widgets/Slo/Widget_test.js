/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import Widget from './Widget';

jest.mock('in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Slo/Widget', () => {
  const config = {
    entityType: 'application',
    entityId: 'test-entity',
    slo: 0,
    sliConfigId: 'test-config',
    timeWindowType: 'dynamic'
  };

  it('should render widget with WidgetLeftHeader if configuration status is pending.', () => {
    useSliConfiguration.mockReturnValueOnce([
      {
        id: config.sliConfigId
      },
      'pending'
    ]);

    const widgetElement = shallow(
      <Widget actions={<></>} config={config} isPreview title="Test Widget" dragHandle={<></>} />
    );

    expect(widgetElement.prop('leftHeaderContent')).not.toBeUndefined();
  });

  it('should render widget with WidgetLeftHeader if configuration status is resolved.', () => {
    useSliConfiguration.mockReturnValueOnce([
      {
        id: config.sliConfigId
      },
      'resolved'
    ]);

    const widgetElement = shallow(
      <Widget actions={<></>} config={config} isPreview title="Test Widget" dragHandle={<></>} />
    );

    expect(widgetElement.prop('leftHeaderContent')).not.toBeUndefined();
  });

  it('should render widget without WidgetLeftHeader if configuration status is rejected.', () => {
    useSliConfiguration.mockReturnValueOnce([
      {
        id: config.sliConfigId
      },
      'rejected'
    ]);

    const widgetElement = shallow(
      <Widget actions={<></>} config={config} isPreview title="Test Widget" dragHandle={<></>} />
    );

    expect(widgetElement.prop('leftHeaderContent')).toBeUndefined();
  });
});
