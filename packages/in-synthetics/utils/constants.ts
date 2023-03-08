/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

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
  ApplicationItem
} from 'in-types';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { syntheticsPath, resultsTab } from 'in-synthetics/navigation/paths';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { Options } from 'in-hooks/useUrlState';

export const pathSegment = syntheticsPath;
export const matrixPrefix = '';
export const getOperation = 'GET';
export const resultsPathSegment = resultsTab;
export const resultsMatrixPrefix = 'result.';
export const failureValue = '0';
export const defaultPage = 'page_x0';
export const successValue = '1';

export const dummyLocations = {
  data: [],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyApplications = {
  data: [] as ApplicationItem[],
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
  agentKeys: string[];
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
}

export interface FilterSectionProps extends FilterState {
  setFilter: (x: Object) => void;
  isAppcontext?: boolean;
  result?: Result<PaginatedResult<TestResultListItem>>;
}

export type CurrentState = {
  syntheticTypes?: string[];
  locationIds?: string[];
  applicationIds?: string[];
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

export const applicationsUrlParameter = {
  path: pathSegment,
  name: 'applicationIds',
  as: 'applicationIds',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const filterUrlStateDefinition = {
  bind: [syntheticTypesUrlParameter, locationsUrlParameter, applicationsUrlParameter]
} as Options<UrlState>;

export interface PresenterProps extends FilterState {
  result: Result<PaginatedResult<TestResultListItem>>;
}

export interface ResultsFilterState {
  status: string[];
  locationLabels: string[];
}

export interface ResultsFilterSectionProps extends ResultsFilterState {
  setFilter: (x: Object) => void;
  result: TestResponse;
}

export type ResultsCurrentState = {
  status?: string[];
  locationLabels?: string[];
};

export const resultsFilterUrlStateDefinition = {
  bind: [
    {
      path: resultsPathSegment,
      name: 'status',
      as: 'status',
      initialState: [],
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
