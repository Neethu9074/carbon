import {navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';

const viewGroupings = Object.freeze({
  compose: 'DOCKER_COMPOSE_PROJECT_NAME',
  docker: 'DOCKER_IMAGE',
  ecs: 'ECS_TASK_DEFINITION_FAMILY',
  host: 'HOST',
  infraZone: 'INFRASTRUCTURE_ZONE',
  kube: 'KUBERNETES_POD_NAME',
  marathon: 'MARATHON_APP_ID',
  nomad: 'NOMAD_TASK_NAME',
});

export const humanReadableDescriptions = Object.freeze({
  compose: 'Docker Compose project name',
  custom_container: 'Container labels',
  custom_physical: 'Snapshot data',
  docker: 'Docker image',
  ecs: 'Amazon ECS task definition family',
  host: 'Host',
  infraZone: 'Zone',
  kube: 'Kubernetes pod name',
  marathon: 'Marathon application ID',
  nomad: 'Nomad task name',
});

export const availableGroupings = Object.freeze({
  PHYSICAL: Object.freeze(['infraZone']),
  CONTAINER: Object.freeze(['docker', 'marathon', 'ecs', 'nomad', 'kube', 'infraZone', 'compose', 'host']),
  LOGICAL: Object.freeze([])
});

export const defaultGrouping = Object.freeze({
  PHYSICAL: 'infraZone',
  CONTAINER: 'infraZone',
  LOGICAL: null
});

export const viewGroupingShort$ = createTrackingStore({
  name: 'view/viewGroupingShort',
  observable: navigationParameters$
    .map(params => {
      if (params.query.vg in viewGroupings) {
        return params.query.vg;
      } else if (params.query.vg && params.query.vg.startsWith('custom-')) {
        return params.query.vg;
      }
      return null;
    })
    .distinct()
}).observable;


export const viewGrouping$ = createTrackingStore({
  name: 'view/viewGrouping',
  observable: viewGroupingShort$.map(grouping => {
    if (grouping && grouping.startsWith('custom-')) {
      return grouping;
    }
    return viewGroupings[grouping] || null;
  })
}).observable;
