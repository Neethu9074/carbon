/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { jest } from '@jest/globals';

import {
  REMAINING,
  REMOVING,
  CRITICAL,
  WARNING,
  getFilteredChannels,
  getAlertChannelColumnTitle,
  getAlertChannelTitle,
  updateAlertChannelFormField,
  updateChannelListsToForm,
  updateAlertChannelIds,
  getThresholdFieldStatus,
  updateAllToggleAndFormForWarning,
  updateAllToggleAndFormForCritical,
  updateOnRowToggleAndFormForWarning,
  updateOnRowToggleAndFormForCritical,
  updateDefaultSelectionsToForm,
  updateAlertChannelSelectionOnWarningThresholdFieldChange,
  updateAlertChannelSelectionOnCriticalThresholdFieldChange
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import { t } from 'in-i18n';

describe('getFilteredChannels', () => {
  const enabledList = {
    WARNING: [1, 2, 3, 4],
    CRITICAL: [5, 6, 7, 8]
  };
  const filteredChannelList = [{ id: 1 }, { id: 3 }, { id: 7 }];

  it('should return remaining channels for WARNING type when condition is REMAINING', () => {
    const result = getFilteredChannels(enabledList, WARNING, filteredChannelList, REMAINING);
    expect(result).toEqual([2, 4]); // IDs 1 and 3 are filtered out
  });

  it('should return remaining channels for CRITICAL type when condition is REMAINING', () => {
    const result = getFilteredChannels(enabledList, CRITICAL, filteredChannelList, REMAINING);
    expect(result).toEqual([5, 6, 8]); // ID 7 is filtered out
  });

  it('should return removing channels for WARNING type when condition is REMOVING', () => {
    const result = getFilteredChannels(enabledList, WARNING, filteredChannelList, REMOVING);
    expect(result).toEqual([1, 3]); // Only IDs 1 and 3 are retained
  });

  it('should return removing channels for CRITICAL type when condition is REMOVING', () => {
    const result = getFilteredChannels(enabledList, CRITICAL, filteredChannelList, REMOVING);
    expect(result).toEqual([7]); // Only ID 7 is retained
  });

  it('should handle empty filteredChannelList for WARNING type', () => {
    const result = getFilteredChannels(enabledList, WARNING, [], REMAINING);
    expect(result).toEqual([1, 2, 3, 4]); // All WARNING items remain
  });

  it('should handle empty filteredChannelList for CRITICAL type', () => {
    const result = getFilteredChannels(enabledList, CRITICAL, [], REMAINING);
    expect(result).toEqual([5, 6, 7, 8]); // All CRITICAL items remain
  });

  it('should default condition to REMAINING if not provided', () => {
    const result = getFilteredChannels(enabledList, WARNING, filteredChannelList);
    expect(result).toEqual([2, 4]); // Same as REMAINING condition
  });

  it('should return an empty array for undefined enabledList', () => {
    const result = getFilteredChannels(undefined, WARNING, filteredChannelList, REMAINING);
    expect(result).toEqual([]); // No enabledList
  });

  it('should return an empty array for invalid thresholdType', () => {
    const result = getFilteredChannels(enabledList, 'INVALID_TYPE', filteredChannelList, REMAINING);
    expect(result).toEqual([]); // Invalid thresholdType
  });
});

describe('getAlertChannelColumnTitle', () => {
  it('should return "Alert Level" when WARNING channels are present and critical field is disabled', () => {
    const result = getAlertChannelColumnTitle(WARNING, false, true, { WARNING: [1] });
    expect(result).toBe(t('in-alerting:smartAlerts.alertChannelList.alertLevel'));
  });

  it('should return "Alert Level" when CRITICAL channels are present and warning field is disabled', () => {
    const result = getAlertChannelColumnTitle(CRITICAL, true, false, { CRITICAL: [1] });
    expect(result).toBe(t('in-alerting:smartAlerts.alertChannelList.alertLevel'));
  });

  it('should return "Warning" when both fields are enabled, and thresholdType is WARNING', () => {
    const result = getAlertChannelColumnTitle(WARNING, false, false, {});
    expect(result).toBe(t('in-alerting:smartAlerts.alertChannelList.warning'));
  });

  it('should return "Critical" when both fields are enabled, and thresholdType is CRITICAL', () => {
    const result = getAlertChannelColumnTitle(CRITICAL, false, false, {});
    expect(result).toBe(t('in-alerting:smartAlerts.alertChannelList.critical'));
  });
});

describe('getAlertChannelTitle', () => {
  it('should return "Alert Channels" when called', () => {
    const result = getAlertChannelTitle();
    expect(result).toBe(t('in-settings:tabs.alertChannels'));
  });
});

describe('updateAllToggleAndFormForWarning', () => {
  let onChangeMock;
  const entitiesBeforePagination = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const enabledChannels = {
    WARNING: [1],
    CRITICAL: [4]
  };
  beforeEach(() => {
    onChangeMock = jest.fn();
    jest.clearAllMocks();
  });
  it('should add all entity IDs to WARNING when value is true', () => {
    const updateHandler = updateAllToggleAndFormForWarning(enabledChannels, entitiesBeforePagination, onChangeMock);
    updateHandler(true);
    expect(typeof updateHandler).toBe('function');
  });
  it('should update WARNING and CRITICAL when value is false', () => {
    const updateHandler = updateAllToggleAndFormForWarning(enabledChannels, entitiesBeforePagination, onChangeMock);
    updateHandler(false);
    expect(typeof updateHandler).toBe('function');
  });
});

describe('updateAllToggleAndFormForCritical', () => {
  let onChangeMock;
  const entitiesBeforePagination = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const enabledChannels = {
    WARNING: [1],
    CRITICAL: [4]
  };
  beforeEach(() => {
    onChangeMock = jest.fn();
    jest.clearAllMocks();
  });
  it('should add all entity IDs to CRITICAL when value is true', () => {
    const updateHandler = updateAllToggleAndFormForCritical(enabledChannels, entitiesBeforePagination, onChangeMock);
    updateHandler(true);
    expect(typeof updateHandler).toBe('function');
  });
  it('should update WARNING and CRITICAL when value is false', () => {
    const updateHandler = updateAllToggleAndFormForCritical(enabledChannels, entitiesBeforePagination, onChangeMock);
    updateHandler(false);
    expect(typeof updateHandler).toBe('function');
  });
});

describe('updateOnRowToggleAndFormForWarning', () => {
  let onChangeMock;
  const entity = { id: 2 };
  const enabledChannels = {
    WARNING: [1],
    CRITICAL: [4]
  };
  beforeEach(() => {
    onChangeMock = jest.fn();
    jest.clearAllMocks();
  });
  it('should add entity ID to WARNING when value is true', () => {
    const updateHandler = updateOnRowToggleAndFormForWarning(enabledChannels, entity, onChangeMock);
    updateHandler(true);
    expect(typeof updateHandler).toBe('function');
  });
  it('should remove entity ID from  WARNING and add to CRITICAL, when value is false', () => {
    const updateHandler = updateOnRowToggleAndFormForWarning(enabledChannels, entity, onChangeMock);
    updateHandler(false);
    expect(typeof updateHandler).toBe('function');
  });
});

describe('updateOnRowToggleAndFormForCritical', () => {
  let onChangeMock;
  const entity = { id: 2 };
  const enabledChannels = {
    WARNING: [1],
    CRITICAL: [4]
  };
  beforeEach(() => {
    onChangeMock = jest.fn();
    jest.clearAllMocks();
  });
  it('should add entity ID to CRITICAL when value is true', () => {
    const updateHandler = updateOnRowToggleAndFormForCritical(enabledChannels, entity, onChangeMock);
    updateHandler(true);
    expect(typeof updateHandler).toBe('function');
  });
  it('should remove entity ID from CRITICAL  and add to WARNING, when value is false', () => {
    const updateHandler = updateOnRowToggleAndFormForCritical(enabledChannels, entity, onChangeMock);
    updateHandler(false);
    expect(typeof updateHandler).toBe('function');
  });
});

describe('updateAlertChannelFormField', () => {
  it('should update the alertChannels field with new values and mark it as touched', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };
    const mockOnChange = jest.fn((path, callback) => callback(mockField));

    const newWarningSelections = [1, 2];
    const newCriticalSelections = [3, 4];

    updateAlertChannelFormField(mockOnChange, newWarningSelections, newCriticalSelections);

    expect(mockOnChange).toHaveBeenCalledWith(['alertChannels'], expect.any(Function));
    expect(mockSetValue).toHaveBeenCalledWith({
      WARNING: newWarningSelections,
      CRITICAL: newCriticalSelections
    });
    expect(mockSetTouched).toHaveBeenCalledWith(true);
  });
});

describe('updateDefaultSelectionsToForm', () => {
  it('should call updateChannelListsToForm on warningThresholdFieldDisabled - true', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const selectedList = [1, 2, 3];
    const selectedChannels = { WARNING: [1, 2], CRITICAL: [2, 3] };
    const currentAlertChannelIds = [];

    updateDefaultSelectionsToForm(
      mockForm,
      mockUpdateForm,
      selectedChannels,
      true, // warningThresholdFieldDisabled
      false, // criticalThresholdFieldDisabled
      selectedList,
      currentAlertChannelIds
    );
    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should call updateChannelListsToForm on criticalThresholdFieldDisabled - true', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const selectedList = [1, 2, 3];
    const selectedChannels = { WARNING: [1, 2], CRITICAL: [2, 3] };
    const currentAlertChannelIds = [];

    updateDefaultSelectionsToForm(
      mockForm,
      mockUpdateForm,
      selectedChannels,
      false, // warningThresholdFieldDisabled
      true, // criticalThresholdFieldDisabled
      selectedList,
      currentAlertChannelIds
    );
    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('updateAlertChannelSelectionOnWarningThresholdFieldChange', () => {
  it('Warning field unchecked, update the Critical with values from Warning ', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const alertChannelSelection = { WARNING: [1, 2], CRITICAL: [2, 3] };

    updateAlertChannelSelectionOnWarningThresholdFieldChange(
      alertChannelSelection,
      false, //warningThresholdValuePresent
      true, //criticalThresholdValuePresent
      mockForm,
      mockUpdateForm
    );
    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });

  it('Warning field checked, no critical threshold field, update the Warning field with values ', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const alertChannelSelection = { WARNING: [1, 2], CRITICAL: [2, 3] };

    updateAlertChannelSelectionOnWarningThresholdFieldChange(
      alertChannelSelection,
      true, //warningThresholdValuePresent
      false, //criticalThresholdValuePresent
      mockForm,
      mockUpdateForm
    );
    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('updateAlertChannelSelectionOnCriticalThresholdFieldChange', () => {
  it('Critical field unchecked, update the Warning with values from Warning ', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const alertChannelSelection = { WARNING: [1, 2], CRITICAL: [2, 3] };

    updateAlertChannelSelectionOnCriticalThresholdFieldChange(
      alertChannelSelection,
      false, //warningThresholdValuePresent
      true, //criticalThresholdValuePresent
      mockForm,
      mockUpdateForm
    );
    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });

  it('Critical field checked, no Warning threshold field, update the Critical field with values ', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const alertChannelSelection = { WARNING: [1, 2], CRITICAL: [2, 3] };

    updateAlertChannelSelectionOnCriticalThresholdFieldChange(
      alertChannelSelection,
      true, //warningThresholdValuePresent
      false, //criticalThresholdValuePresent
      mockForm,
      mockUpdateForm
    );
    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('updateChannelListsToForm', () => {
  it('should update the form with selectedChannelList and alertChannels values and mark them as touched', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const selectedList = [1, 2, 3];
    const newWarningSelections = [1, 2];
    const newCriticalSelections = [2, 3];

    updateChannelListsToForm(mockForm, mockUpdateForm, selectedList, newWarningSelections, newCriticalSelections);

    expect(mockForm.updateIn).toHaveBeenCalledWith(['hiddenFields', 'selectedChannelList'], expect.any(Function));
    expect(mockForm.updateIn).toHaveBeenCalledWith(['alertChannels'], expect.any(Function));

    expect(mockSetValue).toHaveBeenCalledWith(selectedList);
    expect(mockSetTouched).toHaveBeenCalledWith(true);

    expect(mockSetValue).toHaveBeenCalledWith({
      WARNING: newWarningSelections,
      CRITICAL: newCriticalSelections
    });

    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('updateAlertChannelIds', () => {
  it('should update the form with  alertChannels values and mark them as touched', () => {
    const mockSetValue = jest.fn().mockReturnThis();
    const mockSetTouched = jest.fn().mockReturnThis();
    const mockField = {
      setValue: mockSetValue,
      setTouched: mockSetTouched
    };

    const mockForm = {
      updateIn: jest.fn((path, callback) => {
        const updatedField = callback(mockField);
        return { ...mockForm, [path.join('.')]: updatedField }; // Simulate the form structure update
      })
    };

    const mockUpdateForm = jest.fn();

    const newWarningSelections = [1, 2];
    const newCriticalSelections = [2, 3];

    updateAlertChannelIds(mockForm, mockUpdateForm, newWarningSelections, newCriticalSelections);

    expect(mockForm.updateIn).toHaveBeenCalledWith(['alertChannels'], expect.any(Function));

    expect(mockSetTouched).toHaveBeenCalledWith(true);

    expect(mockSetValue).toHaveBeenCalledWith({
      WARNING: newWarningSelections,
      CRITICAL: newCriticalSelections
    });

    expect(mockUpdateForm).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('getThresholdFieldStatus', () => {
  const createMockForm = (warningValue, warningCheckbox, criticalValue, criticalCheckbox) => ({
    get: jest.fn(key => {
      if (key === 'threshold') {
        return {
          get: jest.fn(innerKey => {
            if (innerKey === 'warningThreshold') {
              return {
                get: jest.fn(fieldKey => {
                  if (fieldKey === 'value') return { value: warningValue };
                  if (fieldKey === 'isCheckboxSelected') return { value: warningCheckbox };
                })
              };
            }
            if (innerKey === 'criticalThreshold') {
              return {
                get: jest.fn(fieldKey => {
                  if (fieldKey === 'value') return { value: criticalValue };
                  if (fieldKey === 'isCheckboxSelected') return { value: criticalCheckbox };
                })
              };
            }
          })
        };
      }
    })
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should disable warning and critical fields when both values are empty and checkboxes are not selected', () => {
    const form = createMockForm(null, false, null, false);

    const result = getThresholdFieldStatus(form);

    expect(result.warningThresholdFieldDisabled).toBe(true);
    expect(result.criticalThresholdFieldDisabled).toBe(true);
  });

  it('should enable warning field when it has a value or checkbox is selected', () => {
    const form = createMockForm('warningValue', true, null, false);

    const result = getThresholdFieldStatus(form);

    expect(result.warningThresholdFieldDisabled).toBe(false);
    expect(result.criticalThresholdFieldDisabled).toBe(true);
  });

  it('should enable critical field when it has a value or checkbox is selected', () => {
    const form = createMockForm(null, false, 'criticalValue', true);

    const result = getThresholdFieldStatus(form);

    expect(result.warningThresholdFieldDisabled).toBe(true);
    expect(result.criticalThresholdFieldDisabled).toBe(false);
  });
});
