/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.load', 'proc.cpu.user', 'proc.cpu.sys'],
    labels: [
      t('in-forge:plugins.instanaAgent.load'),
      t('in-forge:plugins.process.user'),
      t('in-forge:plugins.process.system')
    ],
    min: 0,
    category: [t('in-forge:plugins.instanaAgent.cpu')],
    formatter: number
  },
  {
    metrics: ['memory.used', 'proc.mem.virtual', 'proc.mem.resident', 'proc.mem.share'],
    labels: [
      t('in-forge:plugins.instanaAgent.used'),
      t('in-forge:plugins.process.virtual'),
      t('in-forge:plugins.process.resident'),
      t('in-forge:plugins.process.share')
    ],
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
  },
  {
    metric: 'proc.openFiles.used',
    label: t('in-forge:plugins.process.used'),
    category: [t('in-forge:plugins.process.openFiles')],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
