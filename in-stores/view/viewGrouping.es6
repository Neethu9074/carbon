import {navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';

const viewGroupings = Object.freeze({
  docker: 'DOCKER_IMAGE',
  marathon: 'MARATHON_APP_ID',
  ecs: 'ECS_TASK_DEFINITION_FAMILY',
  nomad: 'NOMAD_TASK_NAME'
});

export const humanReadableDescriptions = Object.freeze({
  ecs: 'Amazon ECS task definition family',
  docker: 'Docker image',
  marathon: 'Marathon application ID',
  nomad: 'Nomad task name'
});

export const availableGroupings = Object.freeze({
  PHYSICAL: [],
  CONTAINER: ['docker', 'marathon', 'ecs', 'nomad'],
  LOGICAL: []
});

export const defaultGrouping = Object.freeze({
  PHYSICAL: null,
  CONTAINER: 'docker',
  LOGICAL: null
});

export const viewGroupingShort$ = createTrackingStore({
  name: 'view/viewGroupingShort',
  observable: navigationParameters$
    .map(params => {
      if (params.query.vg in viewGroupings) {
        return params.query.vg;
      }
      return null;
    })
    .distinct()
}).observable;


export const viewGrouping$ = createTrackingStore({
  name: 'view/viewGrouping',
  observable: viewGroupingShort$.map(grouping => viewGroupings[grouping] || null)
}).observable;
