/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export interface ThresholdProps {
  alertType: MobileAlertType | WebsitesAlertType;
  form: MapForm<any>;
  blueprintConfig: MobileAppBluePrint | WebsiteBluePrint;
  updateForm?: (form: MapForm<any>) => void;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  ruleMetricNameOptions: {
    statusCode: Option[];
  };
  editMode?: boolean;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
  AlertingChartWithErrorMessage: ReactNode;
  AlertTypeSwitch: (arg: AlertTypeSwitchProps) => React.ReactNode;
}

export default function ThresholdSelectionInteractiveChart({
  alertType,
  blueprintConfig,
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  editMode,
  AlertingChartWithErrorMessage,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  ruleMetricNameOptions,
  AlertTypeSwitch
}: ThresholdProps): JSX.Element {}
