import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'availableReplicas',
    label: 'Available replicas',
    min: 0,
    formatter: number
  },
  {
    metric: 'desiredReplicas',
    label: 'Desired replicas',
    min: 0,
    formatter: number
  },
  {
    metric: 'pods.count',
    label: 'Pods count',
    min: 0,
    formatter: number
  },
  {
    metric: 'conditions.PodScheduled.False',
    label: 'Unscheduled pods',
    min: 0,
    formatter: number
  },
  {
    metric: 'conditions.Ready.False',
    label: 'Unready pods',
    min: 0,
    formatter: number
  },
  {
    metric: 'events.FailedScheduling.count',
    label: 'FailedScheduling events',
    min: 0,
    formatter: number
  },
  {
    metric: 'events.Failed.count',
    label: 'Failed events',
    min: 0,
    formatter: number
  },
  {
    metric: 'events.BackOff.count',
    label: 'BackOff events',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.OutOfDisk.True',
    label: 'OutOfDisk nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.MemoryPressure.True',
    label: 'MemoryPressure nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.DiskPressure.True',
    label: 'DiskPressure nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.KubeletReady.False',
    label: 'KubeletNotReady nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.allocatable_pods',
    label: 'Allocatable pods',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.capacity_cpu',
    label: 'CPU capacity',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.capacity_mem',
    label: 'Memory capacity',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.capacity_pods',
    label: 'Nodes pods capacity',
    min: 0,
    formatter: number
  },
  {
    metric: 'pods.required_cpu',
    label: 'Pods required CPU',
    min: 0,
    formatter: number
  },
  {
    metric: 'pods.required_mem',
    label: 'Pods required memory',
    min: 0,
    formatter: number
  },
  {
    metric: 'pods.limit_cpu',
    label: 'Pods CPU limit',
    min: 0,
    formatter: number
  },
  {
    metric: 'pods.limit_mem',
    label: 'Pods memory limit',
    min: 0,
    formatter: number
  }
];
