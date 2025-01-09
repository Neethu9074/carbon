/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  getHeaderTitle,
  toAlertConfig,
  fromAlertConfig,
  generateAlertConfig,
  getApplicationAlertConfig
} from 'in-alerting/smart-alerts/applications/tearSheet/components/AlertConfigHelper';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

const alertConfigData = {
  evaluationType: 'PER_AP',
  granularity: 600000,
  gracePeriod: 600000,
  id: '',
  includeInternal: false,
  includeSynthetic: false,
  name: 'Calls are slower than usual',
  readOnly: false,
  alertChannelIds: [],
  applicationId: undefined,
  alertChannels: { WARNING: [], CRITICAL: [] },
  applications: {},
  boundaryScope: 'INBOUND',
  builtIn: undefined,
  created: 0,
  customPayloadFields: [],
  description: 'Calls are slower or equal to  ms based on latency (90th).',
  enabled: true,
  tagFilterExpression: {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  },
  timeThreshold: {
    timeWindow: 600000,
    type: 'violationsInSequence'
  },
  triggering: false,
  rules: [
    {
      rule: {
        aggregation: 'P90',
        alertType: 'slowness',
        metricName: 'latency'
      },
      thresholdOperator: '>=',
      thresholds: {
        WARNING: {
          type: 'staticThreshold',
          value: 0,
          isCheckboxSelected: true
        }
      }
    }
  ]
};

describe('in-alerting/smart-alerts/applications/tearSheet/components/AlertConfigHelper', () => {
  describe('getDetailedMetricTooltipValueFormatter', () => {
    it('returns "Edit alert"', () => {
      const result = getHeaderTitle(true, true, false);
      expect(result).toBe(
        t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetEditAlert_Global')
      );
    });

    it('returns "Create new alert"', () => {
      const result = getHeaderTitle(false, false, false);
      expect(result).toBe(
        t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetCreateNewAlert_Local')
      );
    });

    it('returns "Migrate to smart alerts"', () => {
      const result = getHeaderTitle(true, false, true);
      expect(result).toBe(t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetMigrateAlert'));
    });
  });

  describe('getDetailedMetricTooltipValueFormatter', () => {
    const alertConfig = {
      rules: [
        {
          thresholds: {
            WARNING: {
              type: 'staticThreshold',
              value: 0,
              isCheckboxSelected: true
            }
          }
        }
      ]
    };
    //@ts-expect-error
    const form = createSmartAlertForm(alertConfig, false, false);

    const alertConfigFormData = toAlertConfig(form);

    expect(alertConfigFormData).toEqual(alertConfigData);
  });

  describe('fromAlertConfig', () => {
    it('returns an object with the correct properties', () => {
      const alertConfig = {
        ...alertConfigData,
        rule: {
          aggregation: 'P90',
          alertType: 'statusCode',
          metricName: 'latency',
          statusCodeEnd: 123,
          statusCodeStart: 123
        },
        rules: [
          {
            ...alertConfigData.rules[0],
            rule: {
              aggregation: 'P90',
              alertType: 'statusCode',
              metricName: 'latency',
              statusCodeEnd: 123,
              statusCodeStart: 123
            }
          }
        ]
      };

      const expectedResult = {
        ...alertConfig,
        rules: [
          {
            ...alertConfigData.rules[0],
            rule: {
              statusCode: { statusCodeEnd: 123, statusCodeStart: 123 },
              aggregation: 'P90',
              alertType: 'statusCode',
              metricName: 'latency'
            },
            thresholds: {
              ...alertConfigData.rules[0].thresholds,
              CRITICAL: {
                deviationFactor: defaultDeviationFactor,
                isCheckboxSelected: false,
                type: 'staticThreshold',
                value: null
              }
            }
          }
        ]
      };
      expect(fromAlertConfig(alertConfig)).toEqual(expectedResult);
    });
  });

  describe('generateAlertConfig', () => {
    it('should return a static threshold config ', () => {
      const config = generateAlertConfig(true);
      expect(config).toEqual({
        threshold: {
          type: STATIC_THRESHOLD
        },
        rules: [
          {
            rule: {
              aggregation: 'P90',
              alertType: 'slowness',
              metricName: 'latency'
            },
            thresholdOperator: '>=',
            thresholds: {
              WARNING: {
                type: STATIC_THRESHOLD,
                isCheckboxSelected: false
              },
              CRITICAL: {
                type: STATIC_THRESHOLD,
                isCheckboxSelected: false
              }
            }
          }
        ]
      });
    });

    it('should return a historic baseline threshold config', () => {
      const config = generateAlertConfig(false, '123', 'scope', '0', '0', false);
      expect(config).toEqual({
        boundaryScope: 'scope',
        threshold: { type: HISTORIC_BASELINE, value: 0, seasonality: DAILY },
        rules: [
          {
            rule: {
              aggregation: 'P90',
              alertType: 'slowness',
              metricName: 'latency'
            },
            thresholdOperator: '>=',
            thresholds: {
              WARNING: {
                type: HISTORIC_BASELINE,
                seasonality: 'DAILY',
                deviationFactor: defaultDeviationFactor,
                isCheckboxSelected: true
              },
              CRITICAL: {
                type: HISTORIC_BASELINE,
                deviationFactor: defaultDeviationFactor,
                isCheckboxSelected: false,
                seasonality: 'DAILY',
                value: 0
              }
            }
          }
        ],
        calculateThresholdOnBackend: true,
        includeSynthetic: false,
        applications: {
          123: {
            applicationId: '123',
            inclusive: false,
            services: {
              0: {
                endpoints: {
                  0: {
                    endpointId: '0',
                    inclusive: true
                  }
                },
                inclusive: false,
                serviceId: '0'
              }
            }
          }
        }
      });
    });
  });

  describe('getApplicationAlertConfig', () => {
    const applicationIds = {
      applicationId: 'AP-123',
      serviceId: 'SER-123',
      endpointId: 'END-123'
    };
    const isGlobalSmartAlert = true;

    const migrateAlertConfig = {};
    const boundaryScope = 'ALL';

    it('test edit mode', () => {
      const applicationMode = {
        editMode: true
      };

      const result = getApplicationAlertConfig(
        isGlobalSmartAlert,
        alertConfigData,
        migrateAlertConfig,
        boundaryScope,
        applicationIds,
        applicationMode
      );

      expect(result).toEqual(alertConfigData);
    });

    it('test migration mode', () => {
      const applicationMode = {
        migrationMode: true
      };
      const migrateAlertConfig = {};

      const result = getApplicationAlertConfig(
        isGlobalSmartAlert,
        alertConfigData,
        migrateAlertConfig,
        boundaryScope,
        applicationIds,
        applicationMode
      );

      expect(result).toEqual(migrateAlertConfig);
    });

    it('test duplicate mode', () => {
      const applicationMode = {
        duplicateMode: true
      };
      const result = getApplicationAlertConfig(
        isGlobalSmartAlert,
        alertConfigData,
        migrateAlertConfig,
        boundaryScope,
        applicationIds,
        applicationMode
      );

      expect(result).toEqual(duplicateAlertConfig(alertConfigData));
    });

    it('test alertConfig', () => {
      const applicationMode = {};
      const result = getApplicationAlertConfig(
        isGlobalSmartAlert,
        alertConfigData,
        migrateAlertConfig,
        boundaryScope,
        applicationIds,
        applicationMode
      );

      expect(result).toEqual(
        generateAlertConfig(
          isGlobalSmartAlert,
          applicationIds?.applicationId,
          boundaryScope,
          applicationIds?.serviceId,
          applicationIds?.endpointId
        )
      );
    });
  });
});
