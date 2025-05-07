/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import { ReactNode } from 'react';

import { Observable } from '@instana/observables';

import {
  PaginatedResult,
  Progress,
  Result,
  SyntheticLocation,
  SyntheticTest,
  TestResultDetailData,
  TestResultListItem,
  TestResultSubtransaction,
  Error,
  PoPInstallationProperties,
  TestResultMetadata,
  SyntheticDatacenter,
  GroupPermissionEntity,
  DNSQueryType,
  SyntheticTestFilterOperator
} from 'in-types';
import { syntheticsPath, resultsTab, syntheticLocationPath } from 'in-synthetics/navigation/paths';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { TableActions } from 'in-settings/components/List';
import { Options } from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

export const pathSegment = syntheticsPath;
export const matrixPrefix = '';
export const getOperation = 'GET';
export const resultsPathSegment = resultsTab;
export const resultsMatrixPrefix = 'result.';
export const failureValue = '0';
export const defaultPage = 'page_x0';
export const successValue = '1';
export const apiSimpleTest = 'API Simple';
export const apiScriptTest = 'API Script';
export const browserSimpleTest = 'Browser Simple';
export const browserScriptTest = 'Browser Script';
export const SSLCertificateTest = 'Certificate Check';
export const expectStatus = 'Expect Status';
export const expectJson = 'Expect JSON';
export const expectMatch = 'Expect Match';
export const allAccessFilter = 'Selectable tests';
export const inheritedAccessFilter = 'Inherited tests';
export const association = {
  applications: 'Applications',
  websites: 'Websites',
  mobileApps: 'Mobile Apps'
};
export const selectableCredentialsFilter = 'Selectable credentials';
export const inheritedCredentialsFilter = 'Inherited credentials';
export const syntheticCustomMetricPrefix = 'synthetic.customMetrics.';

// CI/CD
export const runTypeCICD = 'CI/CD';

export const DNSTransportOptions: { label: string; value: string }[] = [
  {
    label: 'UDP',
    value: 'UDP'
  },
  {
    label: 'TCP',
    value: 'TCP'
  }
];

export const assertionQueryTypes: { label: DNSQueryType; value: DNSQueryType }[] = [
  {
    label: 'A',
    value: 'A'
  },
  {
    label: 'AAAA',
    value: 'AAAA'
  },
  {
    label: 'CNAME',
    value: 'CNAME'
  },
  {
    label: 'NS',
    value: 'NS'
  }
];

export const DNSQueryTypes: { label: string; value: string }[] = [
  ...assertionQueryTypes,
  {
    label: 'ANY',
    value: 'ANY'
  },
  {
    label: 'ALL',
    value: 'ALL'
  },
  {
    label: 'ALL associated with assertions',
    value: 'ALL_CONDITIONS'
  }
];

export const DNSFilterOperators: { label: string; value: SyntheticTestFilterOperator }[] = [
  {
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.operatorOptionContains'),
    value: 'CONTAINS'
  },
  {
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.operatorOptionMatches'),
    value: 'MATCHES'
  },
  {
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.operatorOptionIs'),
    value: 'IS'
  },
  {
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.operatorOptionNotMatches'),
    value: 'NOT_MATCHES'
  }
];

export const scriptTestType = (fileExtension: string, syntheticType: string) => {
  if (fileExtension === 'js' || fileExtension === 'zip') return 'BrowserScript';
  if (fileExtension === 'side') return 'WebpageScript';
  return syntheticType;
};

export const dummySyntheticDatacenter: SyntheticDatacenter = {
  cityName: '',
  code: '',
  countryName: '',
  label: '',
  provider: ''
};

export const dummyResultSynDatacenter: Result<SyntheticDatacenter[]> = {
  data: {} as SyntheticDatacenter[],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyLocations = {
  data: [],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyTests: Result<SyntheticTest[]> = {
  data: [] as SyntheticTest[],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyTest: Result<SyntheticTest> = {
  data: {} as SyntheticTest,
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyLocationn: Result<SyntheticLocation> = {
  data: {} as SyntheticLocation,
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyResultDetails: Result<ResultDetails> = {
  data: {} as ResultDetails,
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyResultMetadata: Result<ResultMetadata> = {
  data: {} as ResultMetadata,
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyTestResultList: Result<PaginatedResult<TestResultListItem>[]> = {
  data: [] as PaginatedResult<TestResultListItem>[],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyTestResultLogs: Result<ResultLogs> = {
  data: {} as ResultLogs,
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyPoPProperties: Result<PoPInstallationProperties> = {
  data: {} as PoPProperties,
  errors: [],
  progress: {
    loading: true
  }
};

export interface ResultDetails {
  testId: string;
  testResultId: string;
  subtransactions: TestResultSubtransaction[];
}

export interface ResultMetadata {
  testId: string;
  testResultId: string;
  metadata: { [index: string]: string };
}

export interface ResultLogs {
  testId: string;
  testResultId: string;
  logs: string;
  logFiles: { [index: string]: any };
}

export interface PoPProperties {
  agentKey: string;
  downloadKey: string;
  syntheticAcceptorURL: string;
}

export interface UrlState {
  orderBy: string;
  orderDirection: string;
  page: number;
  query: string;
}

export const defaultUrlState: UrlState = {
  orderBy: 'name',
  orderDirection: 'ASC',
  page: 1,
  query: ''
};

export interface TestResponse {
  data: SyntheticTest;
  errors: Error[];
  progress: Progress;
  time?: number;
}

export interface DatacenterResponse {
  data: SyntheticDatacenter[];
  errors: Error[];
  progress: Progress;
  time?: number;
}

export interface ResultDetailsResponse {
  data?: TestResultDetailData;
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export interface ResultMetadataResponse {
  data?: TestResultMetadata;
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export interface TestResultLog {
  data?: ResultLogs;
  errors: Error[];
  progress: Progress;
}

export interface FilterProps {
  filter: { query: string; type: string };
  setFilter: (a: { query: string; type: string }) => void;
  isBrowserType?: boolean;
}

export interface PoPInstallationPropertiesResponse {
  data?: PoPProperties;
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export interface TestResultEntry {
  cache: { [index: string]: any };
  connection: string;
  pageref: string;
  request: { [index: string]: any };
  response: { [index: string]: any };
  serverIPAddress: string;
  startedDateTime: string;
  time: number;
  timings: { [index: string]: any };
  _resourceType: string;
}

export interface TestResultHARPage {
  comment: string;
  id: string;
  pageTimings: { [index: string]: any };
  startedDateTime: string;
  title: string;
  _mimeType: string;
  _url: string;
  totalResponseSize: number;
}

export const urlStateDefinition = {
  bind: [
    {
      path: syntheticsPath,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: syntheticsPath,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: syntheticsPath,
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: intParser
    },
    {
      path: syntheticsPath,
      name: 'query',
      as: 'query',
      initialState: ''
    }
  ],
  resets: [
    {
      bind: [],
      reset: defaultUrlState
    }
  ]
} as Options<UrlState>;

export type SubtransactionsProps = {
  errors?: Error[];
  subtransactions?: TestResultSubtransaction[];
  earliestTimestamp?: number;
  endTimestamp?: number;
};

export type OverviewChartToolTipProps = {
  subtransaction: TestResultSubtransaction;
};

export interface FilterState {
  syntheticTypes: string[];
  locationIds: string[];
  applicationIds?: string[];
  entityIds?: string[];
}

export interface FilterLocationState {
  locationTypes: string[];
}

export interface FilterSectionProps extends FilterState {
  setFilter: (x: Object) => void;
  isAssociationsContext?: boolean;
  result?: Result<SyntheticTest[]>;
}

export type CurrentState = {
  syntheticTypes?: string[];
  locationIds?: string[];
  applicationIds?: string[];
  entityIds?: string[];
};

export type CurrentLocationsState = {
  locationTypes?: string[];
};

export type Timing = {
  label: string;
  value: number;
};

export const syntheticTypesUrlParameter = {
  path: pathSegment,
  name: 'syntheticTypes',
  as: 'syntheticTypes',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const locationsUrlParameter = {
  path: pathSegment,
  name: 'locationIds',
  as: 'locationIds',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const locationTypesUrlParameter = {
  path: syntheticLocationPath,
  name: 'locationTypes',
  as: 'locationTypes',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const applicationsUrlParameter = {
  path: pathSegment,
  name: 'applicationIds',
  as: 'applicationIds',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const entityIdsUrlParameter = {
  path: pathSegment,
  name: 'entityIds',
  as: 'entityIds',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const filterLocationTypesUrlStateDefinition = {
  bind: [locationTypesUrlParameter]
} as Options<UrlState>;

export const filterUrlStateDefinition = syntheticRbacLimitedEnabled
  ? ({
      bind: [syntheticTypesUrlParameter, locationsUrlParameter, entityIdsUrlParameter]
    } as Options<UrlState>)
  : ({
      bind: [syntheticTypesUrlParameter, locationsUrlParameter, applicationsUrlParameter]
    } as Options<UrlState>);

export const filterLocationUrlStateDefinition = {
  bind: [locationsUrlParameter]
} as Options<UrlState>;

export interface PresenterProps extends FilterState {
  syntheticTests: Result<SyntheticTest[]>;
}

export interface ResultsFilterState {
  status: string[];
  locationLabels: string[];
}

export interface ResultsFilterSectionProps extends ResultsFilterState {
  setFilter: (x: Object) => void;
  locationsDisplayLabels: string[];
}

export type ResultsCurrentState = {
  status?: string[];
  locationLabels?: string[];
};

export const resultsFilterUrlStateDefinition = (selectedMetric?: string) => {
  const urlState = {
    bind: [
      {
        path: resultsPathSegment,
        name: 'status',
        as: 'status',
        initialState: selectedMetric === 'status' ? ['0'] : [],
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      },
      {
        path: resultsPathSegment,
        name: 'locationLabels',
        as: 'locationLabels',
        initialState: [],
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      }
    ]
  } as Options<UrlState>;
  return urlState;
};

export interface AdvancedModeProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  renderSectionsCounter: number;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  setCustomSlideInHeaderConfig: React.Dispatch<React.SetStateAction<SlideInHeader>>;
  isUpdateConfig: boolean;
  scriptDetails?: Code;
  setScriptDetails?: React.Dispatch<React.SetStateAction<Code>>;
  headers: ConfigItem[];
  setHeaders: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
  invalidHeader: Invalid;
  setInvalidHeader: React.Dispatch<React.SetStateAction<Invalid>>;
  invalidJSON: Invalid;
  setInvalidJSON: React.Dispatch<React.SetStateAction<Invalid>>;
  customProperties: ConfigItem[];
  setCustomProperties: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
  invalidCustomProperty: Invalid;
  setInvalidCustomProperty: React.Dispatch<React.SetStateAction<Invalid>>;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
  targetFilters: AssertionTargetFilter[];
  setTargetFilters: React.Dispatch<React.SetStateAction<AssertionTargetFilter[]>>;
  showAssertionsWarning: boolean;
  setShowAssertionsWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SlideInConfig {
  title?: string;
  component?: ReactNode;
}

export interface SliderState {
  slideInConfig?: SlideInConfig;
  isVisible: boolean;
}

export interface ConfigItem {
  id: string;
  key: string;
  value: string;
  error: Record<string, ErrorType>;
}

export interface Validation {
  id: string;
  key: string;
  value: string | Record<string, string>;
  fieldName: string;
}

interface Field {
  field: string;
  label: string;
}

export const placeholders: Record<string, Field> = {
  'Expect Status': {
    field: 'expectStatus',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectStatusPlaceholder')
  },
  'Expect JSON': {
    field: 'expectJson',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectJSONPlaceholder')
  },
  'Expect Match': {
    field: 'expectMatch',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectMatchPlaceholder')
  }
};

export interface ErrorType {
  invalid: boolean;
  message: string;
}

export interface SlideInHeader {
  title: string | null;
  onClose: (() => void) | null;
}

export interface Script {
  name: string;
  text: string;
  scriptFile?: string;
  errorMessage?: string;
  extension: string;
}

export interface Zip {
  name: string;
  files: string[];
  blob: File | null;
}

export interface Code {
  modified: boolean;
  name: string;
}

export interface NotificationState {
  show: boolean;
  variant?: 'success' | 'failure';
  message?: string;
}

export interface ModalNotificationProps {
  variant?: 'success' | 'failure';
  message: string;
  onClick?: () => void;
}

export interface SimpleOrScript {
  simple: boolean;
  script: boolean;
}

interface Simple {
  simple: boolean;
}

export interface TestTypeSelected {
  api: SimpleOrScript;
  browser: SimpleOrScript;
  ssl: Simple;
  dns: Simple;
}

export interface Invalid {
  invalid: boolean;
  message: string;
}

export interface BrowserMessage {
  level: string;
  message: string;
  timestamp: number;
  type: string;
}

export interface ResultImages {
  testId: string;
  testResultId: string;
  imageFiles: { [index: string]: string };
}

export const dummyTestResultImages: Result<ResultImages> = {
  data: {} as ResultImages,
  errors: [],
  progress: {
    loading: true
  }
};

export interface ViewScreenshotsDialogProps {
  testId: string;
  resultId: string;
  startTime: number;
}

export const timeoutObject: {
  [key: string]: {
    id: string;
    label: string;
    value: string;
  };
} = Object.freeze({
  minutes: {
    id: 'minutes',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldOptionMinutes'),
    value: 'm'
  },
  seconds: {
    id: 'seconds',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldOptionSeconds'),
    value: 's'
  },
  milliseconds: {
    id: 'milliseconds',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldOptionMilliseconds'),
    value: 'ms'
  }
});

export const retriesObject: { id: string; label: string; value: number }[] = [
  {
    id: 'retry-none',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldOptionNone'),
    value: 0
  },
  {
    id: 'retry-once',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldOptionOnce'),
    value: 1
  },
  {
    id: 'retry-twice',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldOptionTwice'),
    value: 2
  }
];

export const datacenterProviderMap = new Map([['aws', 'AWS']]);

export interface Entity {
  title: string;
  tableTitle: string;
  allEntities: () => Observable<GroupPermissionEntity[]>;
  getSelectedEntities: (applicationIds: string[]) => Observable<GroupPermissionEntity[]>;
}

export interface AssociationsStepProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  applications: Result<GroupPermissionEntity[]>;
  setSliderState: (state: SliderState) => void;
}

export interface AssociationsCommonSectionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
}

export interface SelectListDialogContentProps {
  form: MapForm<any>;
  onSubmit: (selectedIds: string[]) => void;
  setSliderState: (state: SliderState) => void;
  entities: () => Observable<GroupPermissionEntity[]>;
  numberOfEntityListRows: number;
  selectedEntity: { key: string; details: Entity };
}

export interface ApplicationsListProps {
  tableActions?: TableActions<GroupPermissionEntity>;
  loadEntities: () => Observable<GroupPermissionEntity[]>;
  noDataMessage?: string;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  hiddenIds?: string[];
  pageSize?: number;
  rightHeader: ReactNode;
  isSearchable?: boolean;
  onRowClick?: (entity: any) => void;
  inSelectListDialog?: boolean;
  getHeader?: (
    totalHitsBeforeFilter: number,
    totalHitsAfterFilter: number,
    entitiesBeforePagination: number
  ) => ReactNode;
}

export interface AssociatedEntitiesListProps {
  title: string;
  tableActions?: TableActions<GroupPermissionEntity>;
  loadEntities: () => Observable<GroupPermissionEntity[]>;
  noDataMessage?: string;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  hiddenIds?: string[];
  pageSize?: number;
  rightHeader?: ReactNode;
  isSearchable?: boolean;
  onRowClick?: (entity: any) => void;
  inSelectListDialog?: boolean;
}

export interface ResultRecording {
  testId: string;
  testResultId: string;
  videos: string;
}

export const dummyTestResultRecording: Result<ResultRecording> = {
  data: {} as ResultRecording,
  errors: [],
  progress: {
    loading: true
  }
};
export interface TargetFilter {
  key: string;
  operator: string;
  value: string;
}

export interface AssertionTargetFilter extends TargetFilter {
  id: string;
  error: {
    key: Invalid;
    operator: Invalid;
    value: Invalid;
  };
}

export interface ConsoleLogColumnProps {
  logs: string;
  name: string;
  timestamp: number;
}

export interface CICDConfig {
  testId: string;
  customization: {
    locations: string[];
    configuration: Record<string, any>;
    customProperties?: Record<string, string>;
  };
}
