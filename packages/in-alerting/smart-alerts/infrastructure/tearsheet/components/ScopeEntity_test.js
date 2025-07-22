/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ScopeEntity, {
  getEntityTagOptions
} from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ScopeEntity';
import { t } from 'in-i18n';

describe('Render Scope Aggregation in Infra SA dialog : in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation', () => {
  const updateForm = jest.fn();
  const useInfrastructureEntities = jest.fn();
  const useTimeConfig = jest.fn();
  const getInfraIconType = jest.fn();

  const mockForm = {
    get: () => ({
      get: () => ({
        value: 'host',
        messages: [],
        touched: false
      })
    }),
    updateIn: jest.fn().mockReturnThis()
  };

  it('Check if component rendered in UI', () => {
    render(<ScopeEntity form={mockForm} updateForm={updateForm} />);

    expect(
      screen.getByText(t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeEntity.entityType'))
    ).toBeInTheDocument();
  });

  it('renders loading indicator when entityItems is undefined', () => {
    useInfrastructureEntities.mockReturnValue({
      tableResult: {}
    });
    useTimeConfig.mockReturnValue({});

    render(<ScopeEntity form={mockForm} updateForm={updateForm} />);

    expect(
      screen.getByText(t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeEntity.loadingEntities'))
    ).toBeInTheDocument();
  });

  it('renders dropdown with options when entityItems are present', async () => {
    useInfrastructureEntities.mockReturnValue({
      tableResult: {
        data: {
          items: [
            { type: 'clrRuntimePlatform', label: '.NET App', count: 48 },
            { type: 'netCoreRuntimePlatform', label: '.NET Core App', count: 1 }
          ]
        }
      }
    });
    useTimeConfig.mockReturnValue({});
    getInfraIconType.mockReturnValue('mock-icon');
    render(<ScopeEntity form={mockForm} updateForm={updateForm} />);
  });

  it('getEntityTagOptions function should return an empty array if input is undefined', () => {
    const result = getEntityTagOptions(undefined);
    expect(result).toEqual([]);
  });

  it('should return an empty array if input is an empty array', () => {
    const result = getEntityTagOptions([]);
    expect(result).toEqual([]);
  });

  it('should map entity items to tag options correctly', () => {
    const mockEntities = [
      { type: 'clrRuntimePlatform', label: '.NET App', count: 48 },
      { type: 'netCoreRuntimePlatform', label: '.NET Core App', count: 1 }
    ];
    getInfraIconType.mockClear();
    getInfraIconType.mockImplementation(type => `${type}-icon`);

    const expected = [
      {
        label: '.NET App',
        tagName: 'clrRuntimePlatform',
        parentLabels: [],
        icon: 'lib_infra_clrRuntimePlatform',
        tagType: 'STRING',
        type: 'TAG'
      },
      {
        label: '.NET Core App',
        tagName: 'netCoreRuntimePlatform',
        parentLabels: [],
        icon: 'lib_infra_netCoreRuntimePlatform',
        tagType: 'STRING',
        type: 'TAG'
      }
    ];

    const result = getEntityTagOptions(mockEntities);
    expect(result).toEqual(expected);
  });
});
