/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

// Import types from multiple sources to support all alert types
import {
  InfraAlertRuleUnion,
  ApplicationAlertRuleUnion,
  StaticThresholdRule,
  StaticBaselineThresholdRule,
  ThresholdOperator,
  RuleWithThreshold,
  ThresholdType,
  AdaptiveThresholdRule,
  WebsiteAlertRuleUnion,
  MobileAppAlertRuleUnion
} from '@instana/types/typeDefinitions';

import { STATIC_THRESHOLD, HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

// Union type for all supported alert rule unions
export type SupportedAlertRuleUnion =
  | InfraAlertRuleUnion
  | ApplicationAlertRuleUnion
  | WebsiteAlertRuleUnion
  | MobileAppAlertRuleUnion;

// Types for the unified threshold form system
export type AlertCategory = 'infrastructure' | 'eum' | 'logs' | 'applications';

export interface UnifiedThresholdFormOptions {
  alertCategory: AlertCategory;
  alertType?: string;
  editMode?: boolean;
}

export interface AlertTypeConfig {
  supportedThresholdTypes: ThresholdType[];
  defaultOperator: ThresholdOperator;
  showCheckboxes: boolean;
  i18nEntries: {
    selectAtLeastOneThreshold: string;
    warningThresholdValidator: string;
    criticalThresholdValidator: string;
    sensitivityValidator?: string;
    baselineEmpty?: string;
    numericValidation?: string;
    invalidNumber?: string;
  };
  numericValidation?: boolean;
}

// Alert type configurations
const ALERT_TYPE_CONFIGS: Record<AlertCategory, AlertTypeConfig> = {
  infrastructure: {
    supportedThresholdTypes: ['staticThreshold', 'adaptiveBaseline'], // NEW: Added adaptive support
    defaultOperator: '>=',
    showCheckboxes: true,
    i18nEntries: {
      selectAtLeastOneThreshold: t('in-alerting:smartAlerts.infrastructure.form.selectAtLeastOneThreshold'),
      warningThresholdValidator: t('in-alerting:smartAlerts.form.warningThresholdValidator'),
      criticalThresholdValidator: t('in-alerting:smartAlerts.form.criticalThresholdValidator'),
      sensitivityValidator: t('in-alerting:smartAlerts.form.sensitivityValidator'),
      invalidNumber: t('in-alerting:smartAlerts.form.invalidNumber')
    }
  },

  eum: {
    supportedThresholdTypes: ['staticThreshold', 'historicBaseline', 'adaptiveBaseline'],
    defaultOperator: '>=',
    showCheckboxes: true,
    numericValidation: true,
    i18nEntries: {
      selectAtLeastOneThreshold: t('in-alerting:smartAlerts.applications.form.selectAtLeastOneThreshold'),
      warningThresholdValidator: t('in-alerting:smartAlerts.form.warningThresholdValidator'),
      criticalThresholdValidator: t('in-alerting:smartAlerts.form.criticalThresholdValidator'),
      sensitivityValidator: t('in-alerting:smartAlerts.form.sensitivityValidator'),
      baselineEmpty: t('in-alerting:smartAlerts.websites.form.errorBaselineIsEmpty'),
      numericValidation: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideANumberGreaterEqualsToZero')
    }
  },

  logs: {
    supportedThresholdTypes: ['staticThreshold'],
    defaultOperator: '>=',
    showCheckboxes: false,
    i18nEntries: {
      selectAtLeastOneThreshold: t('in-alerting:smartAlerts.logs.form.selectAtLeastOneThreshold'),
      warningThresholdValidator: t('in-alerting:smartAlerts.form.warningThresholdValidator'),
      criticalThresholdValidator: t('in-alerting:smartAlerts.form.criticalThresholdValidator')
    }
  },

  applications: {
    supportedThresholdTypes: ['staticThreshold', 'historicBaseline', 'adaptiveBaseline'],
    defaultOperator: '>=',
    showCheckboxes: true,
    i18nEntries: {
      selectAtLeastOneThreshold: t('in-alerting:smartAlerts.applications.form.selectAtLeastOneThreshold'),
      warningThresholdValidator: t('in-alerting:smartAlerts.form.warningThresholdValidator'),
      criticalThresholdValidator: t('in-alerting:smartAlerts.form.criticalThresholdValidator'),
      sensitivityValidator: t('in-alerting:smartAlerts.form.sensitivityValidator'),
      baselineEmpty: t('in-alerting:smartAlerts.applications.form.thresholdFormBaselineIsEmpty')
    }
  }
};

/**
 * Main entry point for creating unified threshold forms across all alert types
 */
export function createUnifiedThresholdForm<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T> | undefined,
  options: UnifiedThresholdFormOptions
): MapForm<any> {
  const config = getAlertConfig(options.alertCategory, options.alertType);

  if (!ruleWithThreshold) {
    return createDefaultThresholdForm(config, options.editMode);
  }

  return createConfiguredThresholdForm(ruleWithThreshold, config, options.editMode);
}

/**
 * Get configuration for specific alert category/type
 */
function getAlertConfig(alertCategory: AlertCategory, alertType?: string): AlertTypeConfig {
  const config = ALERT_TYPE_CONFIGS[alertCategory];

  // Handle special cases like 'specificJsError' in EUM that only supports static thresholds
  if (alertType === 'specificJsError' && alertCategory === 'eum') {
    return {
      ...config,
      supportedThresholdTypes: ['staticThreshold']
    };
  }

  return config;
}

/**
 * Create threshold form for existing rule data
 */
function createConfiguredThresholdForm<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T>,
  config: AlertTypeConfig,
  editMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL;

  // Determine threshold type from existing data
  const thresholdType = determineThresholdType(warningThreshold, criticalThreshold, config);

  // Create form based on threshold type
  switch (thresholdType) {
    case 'staticThreshold':
      return createStaticThresholdForm(ruleWithThreshold, config, editMode);
    case 'historicBaseline':
      return createHistoricBaselineForm(ruleWithThreshold, config, editMode);
    case 'adaptiveBaseline':
      return createAdaptiveBaselineForm(ruleWithThreshold, config, editMode);
    default:
      throw new Error(`Unsupported threshold type: ${thresholdType} for this alert category`);
  }
}

/**
 * Create default threshold form when no existing data
 */
function createDefaultThresholdForm(config: AlertTypeConfig, editMode?: boolean): MapForm<any> {
  const defaultType = config.supportedThresholdTypes[0];

  switch (defaultType) {
    case 'staticThreshold':
      return createStaticThresholdForm(undefined, config, editMode);
    case 'historicBaseline':
      return createHistoricBaselineForm(undefined, config, editMode);
    case 'adaptiveBaseline':
      return createAdaptiveBaselineForm(undefined, config, editMode);
    default:
      return createStaticThresholdForm(undefined, config, editMode);
  }
}

/**
 * Determine threshold type from existing threshold data
 */
function determineThresholdType(warningThreshold: any, criticalThreshold: any, config: AlertTypeConfig): ThresholdType {
  const supportedTypes = new Set(config.supportedThresholdTypes);

  // Check warning threshold type
  if (warningThreshold?.type && supportedTypes.has(warningThreshold.type)) {
    return warningThreshold.type;
  }

  // Check critical threshold type
  if (criticalThreshold?.type && supportedTypes.has(criticalThreshold.type)) {
    return criticalThreshold.type;
  }

  // Default to first supported type
  return config.supportedThresholdTypes[0];
}

/**
 * Create static threshold form
 */
function createStaticThresholdForm<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T> | undefined,
  config: AlertTypeConfig,
  editMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as StaticThresholdRule;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as StaticThresholdRule;

  return createMapForm({
    validator: (formData: any) => validateStaticThresholdForm(formData, config),
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? config.defaultOperator
      }),
      warningThreshold: createStaticThresholdMapForm(warningThreshold, config, editMode),
      criticalThreshold: createStaticThresholdMapForm(criticalThreshold, config, editMode)
    }
  });
}

/**
 * Create static threshold map form for individual threshold
 */
function createStaticThresholdMapForm(
  threshold: StaticThresholdRule | undefined,
  config: AlertTypeConfig,
  editMode?: boolean
): MapForm<any> {
  let form: MapForm<any> = createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? STATIC_THRESHOLD
      })
    )
    .put(
      'value',
      createField({
        value:
          config.showCheckboxes && (threshold as any)?.isCheckboxSelected === true
            ? threshold?.value ?? (threshold?.value === 0 ? 0 : null)
            : threshold?.value ?? null
      }).setTouched(editMode ? !isEmpty(threshold?.value) : false)
    );

  if (config.showCheckboxes) {
    form = form.put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      }).setTouched((threshold as any)?.isCheckboxSelected)
    );
  }

  return form;
}

/**
 * Create historic baseline form
 */
function createHistoricBaselineForm<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T> | undefined,
  config: AlertTypeConfig,
  editMode?: boolean
): MapForm<any> {
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as StaticBaselineThresholdRule;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as StaticBaselineThresholdRule;
  const commonSeasonality = warningThreshold?.seasonality ?? criticalThreshold?.seasonality ?? DAILY;
  const commonBaseline = warningThreshold?.baseline ?? criticalThreshold?.baseline ?? null;
  const commonFields = { seasonality: commonSeasonality, baseline: commonBaseline as BaselineDataSeries };

  return createMapForm({
    validator: (formData: any) => validateBaselineForm(formData, config),
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? config.defaultOperator
      }),
      warningThreshold: createHistoricBaselineMapForm(warningThreshold, commonFields, config, editMode),
      criticalThreshold: createHistoricBaselineMapForm(criticalThreshold, commonFields, config, editMode)
    }
  });
}

/**
 * Create historic baseline map form for individual threshold
 */
function createHistoricBaselineMapForm(
  threshold: StaticBaselineThresholdRule | undefined,
  commonFields: {
    seasonality?: string;
    baseline?: BaselineDataSeries;
  } = {},
  config: AlertTypeConfig,
  editMode: boolean = false
): MapForm<any> {
  const { seasonality = DAILY, baseline } = commonFields;
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? HISTORIC_BASELINE
      })
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      })
    )
    .put(
      'seasonality',
      createField({
        value: seasonality
      })
    )
    .put(
      'baseline',
      createField({
        validator: (array: any) => {
          if (array?.length === 0) {
            return [
              {
                severity: 'error',
                message: config.i18nEntries.baselineEmpty || t('in-alerting:smartAlerts.form.baselineEmpty')
              }
            ];
          }
          return null;
        },
        value: baseline
      })
    )
    .put(
      'deviationFactor',
      createField({
        value: threshold?.deviationFactor
      }).setTouched(editMode ? (threshold as any)?.isCheckboxSelected : false)
    );
}

/**
 * Create adaptive baseline form
 */
function createAdaptiveBaselineForm<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T> | undefined,
  config: AlertTypeConfig,
  _editMode?: boolean
): MapForm<any> {
  const thresholdRule = ruleWithThreshold?.thresholds;
  const warningThreshold = ruleWithThreshold?.thresholds?.WARNING as AdaptiveThresholdRule;
  const criticalThreshold = ruleWithThreshold?.thresholds?.CRITICAL as AdaptiveThresholdRule;

  const commonBaseline = (thresholdRule?.WARNING as any)?.baseline ?? (thresholdRule?.CRITICAL as any)?.baseline ?? [];

  const commonAdaptability =
    (thresholdRule?.WARNING as any)?.adaptability ?? (thresholdRule?.CRITICAL as any)?.adaptability;
  const commonSeasonality =
    (thresholdRule?.WARNING as any)?.seasonality ?? (thresholdRule?.CRITICAL as any)?.seasonality;
  const commonFields = { seasonality: commonSeasonality, adaptability: commonAdaptability };

  return createMapForm({
    validator: (formData: any) => validateBaselineForm(formData, config),
    items: {
      operator: createField({
        value: ruleWithThreshold?.thresholdOperator ?? config.defaultOperator
      }),
      baseline: createField({
        value: commonBaseline
      }),
      warningThreshold: createAdaptiveBaselineMapForm(warningThreshold, commonFields, config),
      criticalThreshold: createAdaptiveBaselineMapForm(criticalThreshold, commonFields, config)
    }
  });
}

/**
 * Create adaptive baseline map form for individual threshold
 */
function createAdaptiveBaselineMapForm(
  threshold: AdaptiveThresholdRule | undefined,
  commonFields: {
    seasonality?: string;
    adaptability?: number;
  } = {},
  _config: AlertTypeConfig
): MapForm<any> {
  const { seasonality, adaptability } = commonFields;
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? ADAPTIVE_BASELINE
      })
    )
    .put(
      'isCheckboxSelected',
      createField({
        value: (threshold as any)?.isCheckboxSelected
      })
    )
    .put(
      'deviationFactor',
      createField({
        value: threshold?.deviationFactor ?? defaultDeviationFactor
      })
    )
    .put(
      'seasonality',
      createField({
        value: seasonality
      })
    )
    .put(
      'adaptability',
      createField({
        value: adaptability
      })
    );
}

/**
 * Validate static threshold form
 */
function validateStaticThresholdForm(formData: any, config: AlertTypeConfig): ValidationResult {
  const { operator, warningThreshold, criticalThreshold } = formData;
  const warningThresholdValue = warningThreshold.get('value')?.value;
  const hasWarningThreshold = !isEmpty(warningThresholdValue);
  const criticalThresholdValue = criticalThreshold.get('value')?.value;
  const hasCriticalThreshold = !isEmpty(criticalThresholdValue);

  // check if thresholdValue is greater than `MAX_SAFE_INTEGER` and > 0
  if (hasWarningThreshold || hasCriticalThreshold) {
    const thresholdValue = hasWarningThreshold ? warningThresholdValue : criticalThresholdValue;
    if (thresholdValue >= Number.MAX_SAFE_INTEGER || thresholdValue < 0) {
      return [
        {
          severity: 'error',
          message: t('in-alerting:smartAlerts.form.invalidNumber')
        }
      ];
    }
  }

  // Threshold comparison validation
  if (hasWarningThreshold && hasCriticalThreshold) {
    const operatorValue = operator?.value;

    if ((operatorValue === '<' || operatorValue === '<=') && warningThresholdValue <= criticalThresholdValue) {
      return [
        {
          severity: 'error',
          message: config.i18nEntries.warningThresholdValidator
        }
      ];
    } else if ((operatorValue === '>' || operatorValue === '>=') && warningThresholdValue >= criticalThresholdValue) {
      return [
        {
          severity: 'error',
          message: config.i18nEntries.criticalThresholdValidator
        }
      ];
    }
  }

  // Numeric validation for EUM
  if (config.numericValidation && (hasWarningThreshold || hasCriticalThreshold)) {
    const thresholdValue = hasWarningThreshold ? warningThresholdValue : criticalThresholdValue;
    if (typeof thresholdValue !== 'number' || thresholdValue < 0) {
      return [
        {
          severity: 'error',
          message: config.i18nEntries.numericValidation
        }
      ];
    }
  }

  // At least one threshold required
  if (!hasWarningThreshold && !hasCriticalThreshold) {
    return [
      {
        severity: 'error',
        message: config.i18nEntries.selectAtLeastOneThreshold
      }
    ];
  }

  return null;
}

/**
 * Validate baseline threshold form (historic and adaptive)
 */
function validateBaselineForm(formData: any, config: AlertTypeConfig): ValidationResult {
  const { warningThreshold, criticalThreshold } = formData;
  const warningDeviationFactor = warningThreshold.get('deviationFactor')?.value;
  const warningCheckboxSelected = warningThreshold.get('isCheckboxSelected')?.value;
  const criticalDeviationFactor = criticalThreshold.get('deviationFactor')?.value;
  const criticalCheckboxSelected = criticalThreshold.get('isCheckboxSelected')?.value;

  // Sensitivity validation for baseline thresholds
  if (warningCheckboxSelected && criticalCheckboxSelected) {
    if (warningDeviationFactor >= criticalDeviationFactor) {
      return [
        {
          severity: 'error',
          message: config.i18nEntries.sensitivityValidator || t('in-alerting:smartAlerts.form.sensitivityValidator')
        }
      ];
    }
  }

  // At least one threshold required
  if (!warningCheckboxSelected && !criticalCheckboxSelected) {
    return [
      {
        severity: 'error',
        message: config.i18nEntries.selectAtLeastOneThreshold
      }
    ];
  }

  return null;
}

// Compatibility exports for existing usage patterns
export { createUnifiedThresholdForm as default };

// Export helper functions for backward compatibility
export function createThresholdRuleForm<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T> | undefined,
  alertCategory: AlertCategory,
  editMode?: boolean
): MapForm<any> {
  return createUnifiedThresholdForm(ruleWithThreshold, {
    alertCategory,
    editMode
  });
}

/**
 * Create threshold form with alert type-specific behavior
 */
export function createThresholdFormForAlertType<T extends SupportedAlertRuleUnion>(
  ruleWithThreshold: RuleWithThreshold<T> | undefined,
  alertCategory: AlertCategory,
  alertType: string,
  editMode?: boolean
): MapForm<any> {
  return createUnifiedThresholdForm(ruleWithThreshold, {
    alertCategory,
    alertType,
    editMode
  });
}
