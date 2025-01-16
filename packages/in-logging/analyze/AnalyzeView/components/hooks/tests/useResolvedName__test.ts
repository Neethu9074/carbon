/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  CONTAINERD_SNAPSHOT_ID,
  CRIO_SNAPSHOT_ID,
  DOCKER_SNAPSHOT_ID,
  GARDEN_SNAPSHOT_ID,
  ID_HOST,
  ID_PROCESS,
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_CUSTOM_KEY_ENDPOINT_TYPE,
  LOG_CUSTOM_KEY_MSG_PARAM,
  LOG_FILE_PATH,
  LOG_KUBERNETES_CLUSTER_NAME,
  LOG_KUBERNETES_DEPLOYMENT_NAME,
  LOG_KUBERNETES_NAMESPACE_NAME,
  LOG_KUBERNETES_NODE_NAME,
  LOG_KUBERNETES_POD_NAME,
  LOG_RETENTION_TIME,
  LOG_SERVICE_NAME,
  LOG_STREAM_NAME
} from 'in-logging/queryBuilder';
// eslint-disable-next-line no-restricted-imports
import useResolvedName, { getCustomKeyLabel, tagNameResolver } from '../useResolvedName';
import { LogTag } from 'in-types';
import { t } from 'in-i18n';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('useResolvedName - Resolved Names', () => {
  const tagToLabelMap = new Map<string, string>([
    ['log.streamName', 'Stream'],
    ['service.name', 'Service'],
    ['kubernetes.cluster.name', 'Cluster'],
    ['kubernetes.node.name', 'Node'],
    ['kubernetes.namespace.name', 'Namespace'],
    ['kubernetes.deployment.name', 'Deployment'],
    ['kubernetes.pod.name', 'Pod'],
    ['id.process', 'Process'],
    ['id.host', 'Host'],
    ['log.file.path', 'File'],
    ['expiration.ts.seconds', 'Retained until'],
    ['id.containerd', 'Containerd container'],
    ['id.docker', 'Docker container'],
    ['id.crio', 'Crio container'],
    ['id.garden', 'Garden container']
  ]);

  const testCases = [
    { tag: LOG_STREAM_NAME, expected: t('in-logging:stream') },
    { tag: LOG_SERVICE_NAME, expected: t('in-logging:service') },
    { tag: LOG_KUBERNETES_CLUSTER_NAME, expected: t('in-logging:cluster') },
    { tag: LOG_KUBERNETES_NODE_NAME, expected: t('in-logging:node') },
    { tag: LOG_KUBERNETES_NAMESPACE_NAME, expected: t('in-logging:namespace') },
    { tag: LOG_KUBERNETES_DEPLOYMENT_NAME, expected: t('in-logging:deployment') },
    { tag: LOG_KUBERNETES_POD_NAME, expected: t('in-logging:pod') },
    { tag: ID_PROCESS, expected: t('in-logging:process') },
    { tag: ID_HOST, expected: t('in-logging:host') },
    { tag: LOG_FILE_PATH, expected: t('in-logging:file') },
    { tag: LOG_RETENTION_TIME, expected: t('in-logging:logExpiration') },
    { tag: CONTAINERD_SNAPSHOT_ID, expected: t('in-logging:containerdContainer') },
    { tag: DOCKER_SNAPSHOT_ID, expected: t('in-logging:dockerContainer') },
    { tag: CRIO_SNAPSHOT_ID, expected: t('in-logging:crioContainer') },
    { tag: GARDEN_SNAPSHOT_ID, expected: t('in-logging:gardenContainer') }
  ];

  it.each(testCases)('should resolve name for $tag correctly', ({ tag, expected }) => {
    const logTag: LogTag = { name: tag };

    const { result } = renderHook(() => useResolvedName(logTag, tagToLabelMap));

    expect(result.current).toBe(expected);
  });
});

describe('getCustomKeyLabel', () => {
  it('should return "applications" translation for LOG_CUSTOM_KEY_APPLICATION_IDS', () => {
    const result = getCustomKeyLabel(LOG_CUSTOM_KEY_APPLICATION_IDS);
    expect(result).toBe(t('in-logging:applications'));
  });

  it('should return "endpoint" translation for LOG_CUSTOM_KEY_ENDPOINT_NAME', () => {
    const result = getCustomKeyLabel(LOG_CUSTOM_KEY_ENDPOINT_NAME);
    expect(result).toBe(t('in-logging:endpoint'));
  });

  it('should return "endpointType" translation for LOG_CUSTOM_KEY_ENDPOINT_TYPE', () => {
    const result = getCustomKeyLabel(LOG_CUSTOM_KEY_ENDPOINT_TYPE);
    expect(result).toBe(t('in-logging:endpointType'));
  });

  it('should return "messageParam" translation for LOG_CUSTOM_KEY_MSG_PARAM prefix', () => {
    const result = getCustomKeyLabel(`${LOG_CUSTOM_KEY_MSG_PARAM}_anyKey`);
    expect(result).toBe(t('in-logging:messageParam'));
  });

  it('should return the key itself if no condition matches', () => {
    const unknownKey = 'UNKNOWN_KEY';
    const result = getCustomKeyLabel(unknownKey);
    expect(result).toBe(unknownKey);
  });
});

describe('useResolvedName', () => {
  const mockUseObservable = useObservable as jest.Mock;

  const tagToLabelMap = new Map<string, string>([['KNOWN_TAG_LABEL', 'Label from map']]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return resolved name from resolver (if condition)', () => {
    const tag = { name: 'KNOWN_TAG_RESOLVER' };

    const resolverMock = jest.fn().mockReturnValue(just('Resolved Name from Resolver'));
    tagNameResolver.set('KNOWN_TAG_RESOLVER', resolverMock);

    mockUseObservable.mockImplementation(() => 'Resolved Name from Resolver');

    const { result } = renderHook(() => useResolvedName(tag, tagToLabelMap));

    expect(result.current).toBe('Resolved Name from Resolver');
    expect(mockUseObservable).toHaveBeenCalledWith(expect.anything(), ['KNOWN_TAG_RESOLVER', tagToLabelMap], {
      resetStateOnObservableChange: true
    });
  });

  it('should return label from tagToLabelMap (else if condition)', () => {
    const tag = { name: 'KNOWN_TAG_LABEL' };

    mockUseObservable.mockImplementation(() => 'Label from map');

    const { result } = renderHook(() => useResolvedName(tag, tagToLabelMap));

    expect(result.current).toBe('Label from map');
    expect(mockUseObservable).toHaveBeenCalledWith(expect.anything(), ['KNOWN_TAG_LABEL', tagToLabelMap], {
      resetStateOnObservableChange: true
    });
  });

  it('should return tag name if no resolver or label exists (else condition)', () => {
    const tag = { name: 'UNKNOWN_TAG' };

    mockUseObservable.mockImplementation(() => 'UNKNOWN_TAG');

    const { result } = renderHook(() => useResolvedName(tag, tagToLabelMap));

    expect(result.current).toBe('UNKNOWN_TAG');
    expect(mockUseObservable).toHaveBeenCalledWith(expect.anything(), ['UNKNOWN_TAG', tagToLabelMap], {
      resetStateOnObservableChange: true
    });
  });
});
