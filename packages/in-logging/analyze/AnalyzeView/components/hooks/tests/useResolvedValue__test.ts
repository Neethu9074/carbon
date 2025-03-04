/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  DOCKER_SNAPSHOT_ID,
  ID_HOST,
  ID_PROCESS,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_RETENTION_TIME
} from 'in-logging/queryBuilder';
import {
  resolveInfraLabel,
  default as useResolvedValue
} from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedValue';
import { timestampToLocaleDate } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import getApplication from 'in-applications/subscriptions/getApplication';
// @ts-expect-error
import { getLabel } from 'in-sdk/snapshot';
import { Application, LogTag, Result } from 'in-types';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

jest.mock('in-stores/snapshot', () => ({
  getSnapshot: jest.fn()
}));

jest.mock('in-sdk/snapshot', () => ({
  getLabel: jest.fn()
}));

jest.mock('../../LogTagsTable/utils', () => ({
  timestampToLocaleDate: jest.fn()
}));

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-i18n', () => ({
  t: jest.fn()
}));

jest.mock('in-applications/subscriptions/getApplication', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('resolveInfraLabel', () => {
  it('should call getSnapshot and return the label using getLabel', done => {
    const snapshotId = 'testSnapshotId';
    const label = 'Test Label';

    (getSnapshot as jest.Mock).mockReturnValue(just(snapshotId));
    (getLabel as jest.Mock).mockReturnValue(label);

    const result$ = resolveInfraLabel(snapshotId);

    result$.subscribe((result: string) => {
      expect(result).toBe(label);
      expect(getSnapshot).toHaveBeenCalledWith(snapshotId);
      expect(getLabel).toHaveBeenCalledWith(snapshotId);
      done();
    }, done.fail);
  });
});

describe('useResolvedValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return stringValue if uniqueTagName is not in longValues', () => {
    const mockTag = { stringValue: 'testStringValue', name: 'testTag' };

    (useObservable as jest.Mock).mockReturnValue('testStringValue');

    const result = useResolvedValue('testTagName', mockTag);

    expect(result).toBe('testStringValue');
    expect(useObservable).toHaveBeenCalledWith(expect.anything(), ['testTag'], {
      resetStateOnObservableChange: true
    });
  });

  it('should return formatted date if uniqueTagName is in longValues', () => {
    const mockTag = { longValue: 1633036800000, name: 'testTag' };

    (useObservable as jest.Mock).mockReturnValue('formattedDate');
    (timestampToLocaleDate as jest.Mock).mockReturnValue('formattedDate');

    const result = useResolvedValue(LOG_RETENTION_TIME, mockTag);
    expect(result).toBe('formattedDate');
    expect(timestampToLocaleDate).toHaveBeenCalledWith(1633036800000);
  });

  it('should resolve infrastructure label for ID_PROCESS', () => {
    const mockTag: LogTag = { stringValue: 'testProcessId', name: 'testTag' };
    const mockLabel = 'Process Label';

    (getSnapshot as jest.Mock).mockReturnValue(just(mockTag.stringValue));
    (getLabel as jest.Mock).mockReturnValue(mockLabel);
    (useObservable as jest.Mock).mockReturnValue(mockLabel);

    const result = useResolvedValue(ID_PROCESS, mockTag);

    expect(result).toBe(mockLabel);
    expect(getSnapshot).toHaveBeenCalledWith(mockTag.stringValue);
    expect(useObservable).toHaveBeenCalledWith(expect.anything(), ['testTag'], {
      resetStateOnObservableChange: true
    });
  });

  it('should resolve infrastructure label for ID_HOST', () => {
    const mockTag: LogTag = { stringValue: 'testHostId', name: 'testTag' };
    const mockLabel = 'Host Label';

    (getSnapshot as jest.Mock).mockReturnValue(just(mockTag.stringValue));
    (getLabel as jest.Mock).mockReturnValue(mockLabel);
    (useObservable as jest.Mock).mockReturnValue(mockLabel);

    const result = useResolvedValue(ID_HOST, mockTag);

    expect(result).toBe(mockLabel);
    expect(getSnapshot).toHaveBeenCalledWith(mockTag.stringValue);
    expect(useObservable).toHaveBeenCalledWith(expect.anything(), ['testTag'], {
      resetStateOnObservableChange: true
    });
  });

  it('should resolve application label for LOG_CUSTOM_KEY_APPLICATION_ID', () => {
    const mockTag: LogTag = { stringValue: 'testAppId', name: 'testTag' };
    const mockApp = { data: { label: 'App Label' } } as Result<Application>;

    (getApplication as jest.Mock).mockReturnValue(just(mockApp));
    (useObservable as jest.Mock).mockReturnValue('App Label');

    const result = useResolvedValue(LOG_CUSTOM_KEY_APPLICATION_ID, mockTag);

    expect(result).toBe('App Label');
    expect(getApplication).toHaveBeenCalledWith({ id: 'testAppId' });
    expect(useObservable).toHaveBeenCalledWith(expect.anything(), ['testTag'], {
      resetStateOnObservableChange: true
    });
  });
  it('should resolve application counter for LOG_CUSTOM-LOG_CUSTOM_KEY_APPLICATION_IDS', () => {
    const mockTag: LogTag = { stringValue: '1,2', name: 'testTag' };
    (t as jest.Mock).mockReturnValue('2 applications');
    (useObservable as jest.Mock).mockReturnValue('2 applications');

    const result = useResolvedValue(`${LOG_CUSTOM}-${LOG_CUSTOM_KEY_APPLICATION_IDS}`, mockTag);

    expect(result).toBe('2 applications');
    expect(t).toHaveBeenCalledWith('in-logging:applicationCounter', { count: 2 });
    expect(useObservable).toHaveBeenCalledWith(expect.anything(), ['testTag'], {
      resetStateOnObservableChange: true
    });
  });

  it('should resolve infrastructure label for containerSnapshotIds', () => {
    const mockTag: LogTag = {
      name: 'testTag',
      stringValue: 'testStringValue',
      longValue: 1633000000
    };

    (getSnapshot as jest.Mock).mockReturnValue(just('SnapshotLabel'));
    (getLabel as jest.Mock).mockReturnValue('SnapshotLabel');
    (useObservable as jest.Mock).mockReturnValue('SnapshotLabel');

    const result = useResolvedValue(DOCKER_SNAPSHOT_ID, mockTag);
    expect(result).toBe('SnapshotLabel');
    expect(getSnapshot).toHaveBeenCalledWith(mockTag.stringValue);
    expect(useObservable).toHaveBeenCalledWith(expect.anything(), ['testTag'], {
      resetStateOnObservableChange: true
    });
  });
});
