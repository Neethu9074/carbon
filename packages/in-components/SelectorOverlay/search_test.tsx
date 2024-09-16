/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-hooks/dom';
import { RangeTuple } from 'fuse.js';

import { TagOptions, MetricOptions } from 'in-components/SelectorOverlay/Node';
import { useSearch } from 'in-components/SelectorOverlay/search';

const nodes: TagOptions[] = [
  {
    type: 'TAG',
    label: 'Root Level Leaf',
    description: 'Funky root leaf',
    icon: 'plugin:host',
    badge: undefined,
    tagName: 'root.level.leaf',
    children: [],
    parentLabels: [],
    tagType: 'STRING'
  },
  {
    type: 'TAG',
    label: 'Root Level Node',
    description: 'Some description',
    icon: 'plugin:neo4j',
    badge: undefined,
    tagName: 'root.level.node',
    tagType: 'STRING',
    parentLabels: [],
    children: [
      {
        type: 'TAG',
        label: 'First Level Leaf',
        description: 'Some description',
        icon: 'plugin:docker',
        badge: undefined,
        tagName: 'first.level.leaf',
        tagType: 'STRING',
        children: [],
        parentLabels: []
      },
      {
        type: 'TAG',
        label: 'First Level Node',
        description: 'Some description',
        icon: 'plugin:mule',
        badge: undefined,
        tagName: 'first.level.node',
        tagType: 'STRING',
        parentLabels: [],
        children: [
          {
            type: 'TAG',
            label: 'Second Level Leaf',
            badge: undefined,
            tagName: 'second.level.leaf',
            tagType: 'STRING',
            children: [],
            parentLabels: []
          },
          {
            type: 'TAG',
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            badge: undefined,
            tagName: 'second.level.node',
            tagType: 'STRING',
            children: [
              {
                type: 'TAG',
                label: 'Third Level Leaf',
                description: 'Some description',
                badge: undefined,
                tagName: 'third.level.leaf',
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

const namespaceOptions: TagOptions[] = [
  {
    type: 'TAG',
    label: 'uid',
    description: 'Kubernetes Namespace UID',
    badge: undefined,
    tagName: 'kubernetes.namespace.uid',
    tagType: 'STRING',
    children: [],
    parentLabels: []
  },
  {
    type: 'TAG',
    label: 'name',
    description: 'Kubernetes namespace name',
    badge: undefined,
    tagName: 'kubernetes.namespace.name',
    tagType: 'STRING',
    children: [],
    parentLabels: []
  }
];

const appNameOptions: TagOptions[] = [
  {
    type: 'TAG',
    label: 'JVM Application name',
    description: 'JVM Application name',
    badge: undefined,
    tagName: 'jvm.application.name',
    tagType: 'STRING',
    children: [],
    parentLabels: []
  },
  {
    type: 'TAG',
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

const adService: TagOptions[] = [
  {
    type: 'TAG',
    label: 'OpenTelemetry sums adservice/app.ads.ad_requests',
    description: 'Custom OpenTelemetry sums value',
    badge: undefined,
    tagName: 'adservice/app.ads.ad_requests',
    tagType: 'STRING',
    children: [],
    parentLabels: ['Others', 'OpenTelemetry SDK']
  }
];

const vehicleRepairHistory: MetricOptions[] = [
  {
    type: 'METRIC',
    label: 'Prometheus histogram vehicle_repair_history',
    description: 'Custom Prometheus histogram value',
    badge: undefined,
    metric: 'metrics.histograms.vehicle_repair_history',
    children: [],
    parentLabels: ['Others', 'Prometheus App']
  }
];

const messageCounts: MetricOptions[] = [
  {
    type: 'METRIC',
    label: 'Message count',
    description: 'Kubernetes Namespace Message Count',
    levelType: 'namespace',
    badge: undefined,
    metric: 'message_count',
    children: [],
    parentLabels: ['Kubernetes', 'Namespace']
  },
  {
    type: 'METRIC',
    label: 'Message count',
    description: 'Kubernetes Pod Message Count',
    levelType: 'pod',
    badge: undefined,
    metric: 'message_count',
    children: [],
    parentLabels: ['Kubernetes', 'Pod']
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

  it('should return metrics', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(vehicleRepairHistory, 'vehicle_repair_history'));
      expect(current.map(o => o.label)).toEqual(
        expect.arrayContaining(['Prometheus histogram vehicle_repair_history'])
      );
    });
  });

  it('should return message count metrics', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(messageCounts, 'message count'));
      expect(current.map(o => o.parentLabels)).toEqual(
        expect.arrayContaining([
          ['Kubernetes', 'Pod'],
          ['Kubernetes', 'Namespace']
        ])
      );
    });
  });
  it('should return item matching all terms', async () => {
    await act(async () => {
      const {
        result: { current }
      } = renderHook(() => useSearch(messageCounts, 'pod message count'));
      expect(current.map(o => o.parentLabels)).toEqual(expect.arrayContaining([['Kubernetes', 'Pod']]));
    });
  });
});
