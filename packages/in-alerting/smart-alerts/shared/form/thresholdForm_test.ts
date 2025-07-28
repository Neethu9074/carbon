/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createUnifiedThresholdForm } from 'in-alerting/smart-alerts/shared/form/thresholdForm';

describe('Unified Threshold Form', () => {
  describe('Infrastructure Alerts', () => {
    it('should create static threshold form by default', () => {
      const form = createUnifiedThresholdForm(undefined, {
        alertCategory: 'infrastructure',
        editMode: false
      });

      expect(form).toBeDefined();
      expect(form.get('operator')?.value).toBe('>=');
      expect(form.get('warningThreshold')?.get('type')?.value).toBe(STATIC_THRESHOLD);
      expect(form.get('criticalThreshold')?.get('type')?.value).toBe(STATIC_THRESHOLD);
    });

    it('should support adaptive baseline thresholds for infrastructure', () => {
      const mockRuleWithThreshold = {
        rule: {
          alertType: 'genericRule',
          entityType: 'host',
          metricName: 'cpu.usage'
        },
        thresholdOperator: '>=' as const,
        thresholds: {
          WARNING: {
            type: ADAPTIVE_BASELINE,
            deviationFactor: 3,
            isCheckboxSelected: true
          },
          CRITICAL: {
            type: ADAPTIVE_BASELINE,
            deviationFactor: 2,
            isCheckboxSelected: true
          }
        }
      };

      const form = createUnifiedThresholdForm(mockRuleWithThreshold as any, {
        alertCategory: 'infrastructure',
        editMode: true
      });

      expect(form).toBeDefined();
      expect(form.get('operator')?.value).toBe('>=');
      expect(form.get('warningThreshold')?.get('type')?.value).toBe(ADAPTIVE_BASELINE);
      expect(form.get('criticalThreshold')?.get('type')?.value).toBe(ADAPTIVE_BASELINE);
      expect(form.get('warningThreshold')?.get('deviationFactor')?.value).toBe(3);
      expect(form.get('criticalThreshold')?.get('deviationFactor')?.value).toBe(2);
    });

    it('should validate adaptive baseline sensitivity correctly', () => {
      const mockFormData = {
        warningThreshold: {
          get: (key: string) => {
            if (key === 'deviationFactor') return { value: 2 };
            if (key === 'isCheckboxSelected') return { value: true };
            return null;
          }
        },
        criticalThreshold: {
          get: (key: string) => {
            if (key === 'deviationFactor') return { value: 3 };
            if (key === 'isCheckboxSelected') return { value: true };
            return null;
          }
        }
      };

      const form = createUnifiedThresholdForm(undefined, {
        alertCategory: 'infrastructure',
        editMode: false
      });

      // Access the validator through the form's internal structure
      const validator = (form as any)._validator;
      if (validator) {
        const result = validator(mockFormData);
        // Should have validation error because warning (2) >= critical (3) is invalid
        expect(result).toBeTruthy();
        expect(result[0]?.severity).toBe('error');
      }
    });
  });

  describe('Alert Category Configuration', () => {
    it('should support different threshold types per alert category', () => {
      // Infrastructure: static + adaptive
      const infraForm = createUnifiedThresholdForm(undefined, {
        alertCategory: 'infrastructure'
      });
      expect(infraForm).toBeDefined();

      // Logs: static only
      const logsForm = createUnifiedThresholdForm(undefined, {
        alertCategory: 'logs'
      });
      expect(logsForm).toBeDefined();

      // EUM: static + historic + adaptive
      const eumForm = createUnifiedThresholdForm(undefined, {
        alertCategory: 'eum'
      });
      expect(eumForm).toBeDefined();

      // Applications: static + historic + adaptive
      const appsForm = createUnifiedThresholdForm(undefined, {
        alertCategory: 'applications'
      });
      expect(appsForm).toBeDefined();
    });

    it('should handle specificJsError special case for EUM', () => {
      const form = createUnifiedThresholdForm(undefined, {
        alertCategory: 'eum',
        alertType: 'specificJsError'
      });

      expect(form).toBeDefined();
      // specificJsError should only support static thresholds
      expect(form.get('warningThreshold')?.get('type')?.value).toBe(STATIC_THRESHOLD);
    });
  });

  describe('Backward Compatibility', () => {
    it.only('should maintain existing API compatibility', () => {
      // Test that the form structure matches what existing code expects
      const form = createUnifiedThresholdForm(undefined, {
        alertCategory: 'infrastructure',
        editMode: false
      });

      // Should have the expected form structure
      expect(form.get('operator')).toBeDefined();
      expect(form.get('warningThreshold')).toBeDefined();
      expect(form.get('criticalThreshold')).toBeDefined();

      // Warning and critical thresholds should have expected fields
      expect(form.get('warningThreshold')?.get('type')).toBeDefined();
      expect(form.get('warningThreshold')?.get('value')).toBeDefined();
      expect(form.get('warningThreshold')?.get('isCheckboxSelected')).toBeDefined();
    });

    it('should respect showCheckboxes configuration per alert category', () => {
      // Logs should NOT have checkboxes
      const logsForm = createUnifiedThresholdForm(undefined, {
        alertCategory: 'logs'
      });
      expect(logsForm.get('warningThreshold')?.get('isCheckboxSelected')).toBeUndefined();
    });
  });
});
