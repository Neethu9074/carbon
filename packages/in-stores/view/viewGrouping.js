/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { containerPath } from 'in-stores/navigation/paths/mainPaths';
import { navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';
import { t } from 'in-i18n';

const viewGroupings = Object.freeze({
  compose: 'DOCKER_COMPOSE_PROJECT_NAME',
  docker: 'DOCKER_IMAGE',
  ecs: 'ECS_TASK_DEFINITION_FAMILY',
  host: 'HOST',
  kube: 'KUBERNETES_NAMESPACE',
  cfApp: 'CF_APP_NAME',
  cfSpace: 'CF_SPACE_NAME',
  marathon: 'MARATHON_APP_ID',
  nomad: 'NOMAD_TASK_NAME',

  infraZone: 'INFRASTRUCTURE_ZONE',
  instanceType: 'FOUNDATION_TYPE',

  cpuCount: 'CPU_COUNT',
  cpuModel: 'CPU_MODEL',
  osArc: 'OS_ARCHITECTURE',
  osName: 'OS_NAME'
});

export const humanReadableDescriptions = Object.freeze({
  compose: t('in-stores:view.viewGroupingsCompose'),
  custom_container: t('in-stores:view.viewGroupingsCustom_container'),
  custom_physical: t('in-stores:view.viewGroupingsCustom_physical'),
  docker: t('in-stores:view.viewGroupingsDocker'),
  ecs: t('in-stores:view.viewGroupingsEcs'),
  host: t('in-stores:view.viewGroupingsHost'),
  kube: t('in-stores:view.viewGroupingsKube'),
  cfApp: t('in-stores:view.viewGroupingsCfApp'),
  cfSpace: t('in-stores:view.viewGroupingsCfSpace'),
  marathon: t('in-stores:view.viewGroupingsMarathon'),
  nomad: t('in-stores:view.viewGroupingsNomad'),

  infraZone: t('in-stores:view.viewGroupingsInfraZone'),
  instanceType: t('in-stores:view.viewGroupingsInstanceType'),

  cpuCount: t('in-stores:view.viewGroupingsCpuCount'),
  cpuModel: t('in-stores:view.viewGroupingsCpuModel'),
  osArc: t('in-stores:view.viewGroupingsOsArc'),
  osName: t('in-stores:view.viewGroupingsOsName')
});

export const availableGroupings = Object.freeze({
  PHYSICAL: Object.freeze(['infraZone', 'cpuCount', 'cpuModel', 'osArc', 'osName', 'instanceType']),
  CONTAINER: Object.freeze([
    'docker',
    'marathon',
    'ecs',
    'nomad',
    'kube',
    'cfApp',
    'cfSpace',
    'infraZone',
    'compose',
    'host'
  ]),
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
      const pathname = params.pathname;
      let grouping = 'vg-i';
      if (pathname.indexOf(containerPath) === 0) {
        grouping = 'vg-c';
      }
      const queryGrouping = params.query[grouping];

      if (queryGrouping in viewGroupings) {
        return queryGrouping;
      } else if (queryGrouping && queryGrouping.indexOf('custom-') === 0) {
        return queryGrouping;
      }
      return null;
    })
    .distinct()
}).observable;

export const viewGrouping$ = createTrackingStore({
  name: 'view/viewGrouping',
  observable: viewGroupingShort$.map(grouping => {
    if (grouping && grouping.indexOf('custom-') === 0) {
      return grouping;
    }
    return viewGroupings[grouping] || null;
  })
}).observable;
