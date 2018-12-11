import { combineLatest } from 'reactive-observables';

import { getSnapshots, getPhysicalHierarchy } from 'in-stores/snapshot';
import { emptyArray } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import search from 'in-subscription/search';

export function getClickhouseWithContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'clickhouseDatabase'
      })
        .flatMap(getSnapshots)
        .flatMap(chSnapshots =>
          combineLatest(chSnapshots.map(clickhouse => getContextForClickhouse(clickhouse, timeConfig)))
        )
    )
    .startWith(emptyArray);
}

export function getContextForClickhouse(clickhouse, timeConfig) {
  return getPhysicalHierarchy(clickhouse.get('id'), false)
    .flatMap(getSnapshots)
    .map(snapshots => {
      return {
        key: clickhouse.get('id'),
        host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
        clickhouse,
        timeConfig
      };
    })
    .filter(row => row.host != null);
}

export function getElasticWithContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'elasticsearchNode'
      })
        .flatMap(getSnapshots)
        .flatMap(elasticSnapshots =>
          combineLatest(elasticSnapshots.map(elastic => getContextForElastic(elastic, timeConfig)))
        )
    )
    .startWith(emptyArray);
}

export function getContextForElastic(elastic, timeConfig) {
  return getPhysicalHierarchy(elastic.get('id'), false)
    .flatMap(getSnapshots)
    .map(snapshots => {
      return {
        key: elastic.get('id'),
        host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
        elastic,
        timeConfig
      };
    })
    .filter(row => row.host != null);
}

export function getCassandraWithContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'cassandraNode'
      })
        .flatMap(getSnapshots)
        .flatMap(cassandraSnapshots =>
          combineLatest(cassandraSnapshots.map(cassandra => getContextForCassandra(cassandra, timeConfig)))
        )
    )
    .startWith(emptyArray);
}

export function getContextForCassandra(cassandra, timeConfig) {
  return getPhysicalHierarchy(cassandra.get('id'), false)
    .flatMap(getSnapshots)
    .map(snapshots => {
      return {
        key: cassandra.get('id'),
        host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
        cassandra,
        timeConfig
      };
    })
    .filter(row => row.host != null);
}

export function getNginxWithContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'nginx'
      })
        .flatMap(getSnapshots)
        .flatMap(nginxSnapshots => combineLatest(nginxSnapshots.map(nginx => getContextForNginx(nginx, timeConfig))))
    )
    .startWith(emptyArray);
}

export function getContextForNginx(nginx, timeConfig) {
  return getPhysicalHierarchy(nginx.get('id'), false)
    .flatMap(getSnapshots)
    .map(snapshots => {
      return {
        key: nginx.get('id'),
        host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
        nginx,
        timeConfig
      };
    })
    .filter(row => row.host != null);
}

export function getDropwizardWithContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'dropwizardApplicationContainer'
      })
        .flatMap(getSnapshots)
        .flatMap(dropwizardSnapshots =>
          combineLatest(dropwizardSnapshots.map(dropwizard => getContextForDropwizard(dropwizard, timeConfig)))
        )
    )
    .startWith(emptyArray);
}

export function getContextForDropwizard(dropwizard, timeConfig) {
  return getPhysicalHierarchy(dropwizard.get('id'), false)
    .flatMap(getSnapshots)
    .map(snapshots => {
      return {
        key: dropwizard.get('id'),
        host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
        container: snapshots.find(s => s.getIn(['plugin']) === 'docker'),
        jvm: snapshots.find(s => s.getIn(['plugin']) === 'jvmRuntimePlatform'),
        dropwizard,
        timeConfig
      };
    })
    .filter(row => row.host != null && row.container != null && row.jvm != null);
}

export function getHostsWithNomadContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'nomadScheduler'
      })
        .flatMap(getSnapshots)
        .flatMap(nomadSnapshots => combineLatest(nomadSnapshots.map(nomad => getContextForNomad(nomad, timeConfig))))
    )
    .startWith(emptyArray);
}

export function getContextForNomad(nomad, timeConfig) {
  return getPhysicalHierarchy(nomad.get('id'), false)
    .flatMap(getSnapshots)
    .map(snapshots => {
      return {
        key: nomad.get('id'),
        host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
        nomad,
        timeConfig
      };
    })
    .filter(row => row.host != null);
}
