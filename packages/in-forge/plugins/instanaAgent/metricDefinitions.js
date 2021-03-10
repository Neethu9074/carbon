/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.load'],
    labels: [t('in-forge:plugins.instanaAgent.load')],
    min: 0,
    category: [t('in-forge:plugins.instanaAgent.cpu')],
    formatter: number
  },
  {
    metrics: ['memory.used'],
    labels: [t('in-forge:plugins.instanaAgent.used')],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.total']);
    },
    category: [t('in-forge:plugins.instanaAgent.memory')],
    formatter: bytes
  },
  {
    metrics: ['memory.nativeUsed'],
    labels: [t('in-forge:plugins.instanaAgent.nativeUsed')],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.nativeTotal']);
    },
    category: [t('in-forge:plugins.instanaAgent.memory')],
    formatter: bytes
  },
  {
    metrics: ['net.rx', 'net.tx'],
    labels: [t('in-forge:plugins.instanaAgent.received'), t('in-forge:plugins.instanaAgent.sent')],
    min: 0,
    category: [t('in-forge:plugins.instanaAgent.network')],
    formatter: bytes
  },
  {
    metrics: ['sensors.time', 'discovery.time', 'sensors.count', 'discovery.count'],
    labels: [
      t('in-forge:plugins.instanaAgent.sensorTime'),
      t('in-forge:plugins.instanaAgent.discoveryTime'),
      t('in-forge:plugins.instanaAgent.sensorCount'),
      t('in-forge:plugins.instanaAgent.discoveryCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.instanaAgent.sensors')],
    formatter: number
  }
];
