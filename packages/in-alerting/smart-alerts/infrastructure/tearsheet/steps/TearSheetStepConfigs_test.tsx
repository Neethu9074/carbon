/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  getFooterActions,
  getButtonLabel
} from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/TearSheetStepConfigs';
import { t } from 'in-i18n';

describe('getFooterActions', () => {
  it('should return an array of length 3', () => {
    const result = getFooterActions(
      () => {},
      () => null,
      () => {},
      false
    );
    expect(result).toHaveLength(3);
  });

  it('should return an array with objects containing the properties "kind", "isLeftAlign", "label", and "onClick"', () => {
    const result = getFooterActions(
      () => {},
      () => null,
      () => {},
      false
    );
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: expect.any(String),
          isLeftAlign: expect.any(Boolean),
          label: expect.any(String),
          onClick: expect.any(Function)
        })
      ])
    );
  });

  it('should return an array with objects containing the properties "kind", "isLeftAlign", "label", and "href"', () => {
    const result = getFooterActions(
      () => {},
      () => '',
      () => {},
      false
    );
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: expect.any(String),
          isLeftAlign: expect.any(Boolean),
          label: expect.any(String),
          href: expect.any(String)
        })
      ])
    );
  });

  it('should return an array with objects containing the properties "kind", "isLeftAlign", "label", and "onClick" when editMode is true', () => {
    const result = getFooterActions(
      () => {},
      () => null,
      () => {},
      true
    );
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: expect.any(String),
          isLeftAlign: expect.any(Boolean),
          label: expect.any(String),
          onClick: expect.any(Function)
        })
      ])
    );
  });
});

describe('getButtonLabel', () => {
  it('should return "Save" when editMode is true', () => {
    const result = getButtonLabel(true);
    expect(result).toBe(t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave'));
  });

  it('should return "Create" when editMode is false', () => {
    const result = getButtonLabel(false);
    expect(result).toBe(t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate'));
  });

  it('should return "Create" when editMode is not provided', () => {
    const result = getButtonLabel();
    expect(result).toBe(t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate'));
  });
});
