/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-hooks/dom';
import { RangeTuple } from 'fuse.js';

import { useSearch } from 'in-components/SelectorOverlay/search';
import { Options } from 'in-components/SelectorOverlay/Node';

const nodes: Options[] = [
  {
    label: 'Root Level Leaf',
    description: 'Funky root leaf',
    icon: 'plugin:host',
    badge: undefined,
    tagName: '',
    children: [],
    parentLabels: [],
    tagType: 'STRING'
  },
  {
    label: 'Root Level Node',
    description: 'Some description',
    icon: 'plugin:neo4j',
    badge: undefined,
    tagName: '',
    tagType: 'STRING',
    parentLabels: [],
    children: [
      {
        label: 'First Level Leaf',
        description: 'Some description',
        icon: 'plugin:docker',
        badge: undefined,
        tagName: '',
        tagType: 'STRING',
        children: [],
        parentLabels: []
      },
      {
        label: 'First Level Node',
        description: 'Some description',
        icon: 'plugin:mule',
        badge: undefined,
        tagName: '',
        tagType: 'STRING',
        parentLabels: [],
        children: [
          {
            label: 'Second Level Leaf',
            badge: undefined,
            tagName: '',
            tagType: 'STRING',
            children: [],
            parentLabels: []
          },
          {
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            badge: undefined,
            tagName: '',
            tagType: 'STRING',
            children: [
              {
                label: 'Third Level Leaf',
                description: 'Some description',
                badge: undefined,
                tagName: '',
                tagType: 'STRING',
                children: [],
                parentLabels: []
              }
            ],
            parentLabels: []
          }
        ]
      }
    ]
  }
];

const namespaceOptions: Options[] = [
  {
    label: 'uid',
    description: 'Kubernetes Namespace UID',
    badge: undefined,
    tagName: 'kubernetes.namespace.uid',
    tagType: 'STRING',
    children: [],
    parentLabels: []
  },
  {
    label: 'name',
    description: 'Kubernetes namespace name',
    badge: undefined,
    tagName: 'kubernetes.namespace.name',
    tagType: 'STRING',
    children: [],
    parentLabels: []
  }
];

const appNameOptions: Options[] = [
  {
    label: 'JVM Application name',
    description: 'JVM Application name',
    badge: undefined,
    tagName: 'jvm.application.name',
    tagType: 'STRING',
    children: [],
    parentLabels: []
  },
  {
    label: 'Application name',
    description: 'Application name',
    badge: undefined,
    tagName: 'application.name',
    tagType: 'STRING',
    children: [],
    parentLabels: [],
    scoreBoost: 10
  }
];

const adService: Options[] = [
  {
    label: 'OpenTelemetry sums adservice/app.ads.ad_requests',
    description: 'Custom OpenTelemetry sums value',
    badge: undefined,
    tagName: 'adservice/app.ads.ad_requests',
    tagType: 'STRING',
    children: [],
    parentLabels: ['Others', 'OpenTelemetry SDK']
  }
];

describe('in-components/SelectorOverlay/useSearch', () => {
  it('should filter by label', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(nodes, 'third'));
      expect(current.map(o => o.label)).toEqual(expect.arrayContaining(['Third Level Leaf']));
    });
  });

  it('should filter by description', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(nodes, 'FunKy'));
      expect(current.map(o => o.description)).toEqual(expect.arrayContaining(['Funky root leaf']));
    });
  });

  it('should sort by relevance', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(namespaceOptions, 'namespace'));
      expect(current.map(o => o.tagName)).toEqual(
        expect.arrayContaining(['kubernetes.namespace.name', 'kubernetes.namespace.uid'])
      );
    });
  });

  it('should sort by relevance with score boost', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(appNameOptions, 'app name'));
      expect(current.map(o => o.tagName)).toEqual(expect.arrayContaining(['application.name', 'jvm.application.name']));
    });
  });

  it('should not return elements with children', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(nodes, 'firstLevelNode'));
      expect(current.map(o => o.label)).toEqual(expect.not.arrayContaining(['First Level Node']));
    });
  });

  describe('should return elements when query matches results', () =>
    it.each([
      ['adservice', [19, 27] as RangeTuple],
      ['adservice/', [19, 28] as RangeTuple],
      ['adservice/app', [19, 31] as RangeTuple],
      ['adservice/app.', [19, 32] as RangeTuple],
      ['adservice/app.ads', [19, 35] as RangeTuple],
      ['adservice/app.ads.ad', [19, 38] as RangeTuple],
      ['adservice/app.ads.ad_', [19, 39] as RangeTuple],
      ['adservice/app.ads.ad_requests', [19, 47] as RangeTuple]
    ])('for query %p should match indices %p', async (token: string, range: RangeTuple) => {
      await act(async () => {
        const {
          result: { current }
        } = renderHook(() => useSearch(adService, token));
        expect(current.map(o => o.label)).toEqual(
          expect.arrayContaining(['OpenTelemetry sums adservice/app.ads.ad_requests'])
        );
        expect(current.map((o: any) => o.matches[0].indices[0])).toEqual([range]);
      });
    }));
});
