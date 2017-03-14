import {navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';

const viewGroupings = Object.freeze({
  docker: 'DOCKER_IMAGE',
  host: 'HOST',
  marathon: 'MARATHON_APP_ID',
  ecs: 'ECS_TASK_DEFINITION_FAMILY',
  nomad: 'NOMAD_TASK_NAME',
  kube: 'KUBERNETES_POD_NAME',
  infraZone: 'INFRASTRUCTURE_ZONE',
  compose: 'DOCKER_COMPOSE_PROJECT_NAME'
});

export const humanReadableDescriptions = Object.freeze({
  ecs: 'Amazon ECS task definition family',
  docker: 'Docker image',
  host: 'Host',
  marathon: 'Marathon application ID',
  nomad: 'Nomad task name',
  kube: 'Kubernetes pod name',
  infraZone: 'Zone',
  compose: 'Docker Compose project name',
  custom: 'Container Labels'
});

export const availableGroupings = Object.freeze({
  PHYSICAL: Object.freeze([]),
  CONTAINER: Object.freeze(['docker', 'marathon', 'ecs', 'nomad', 'kube', 'infraZone', 'compose', 'host']),
  LOGICAL: Object.freeze([])
});

export const defaultGrouping = Object.freeze({
  PHYSICAL: null,
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
