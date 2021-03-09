/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['mem.virtual', 'mem.resident', 'mem.share'],
    labels: [
      t('in-forge:plugins.process.virtual'),
      t('in-forge:plugins.process.resident'),
      t('in-forge:plugins.process.share')
    ],
    min: 0,
    category: [t('in-forge:plugins.process.memory')],
    formatter: bytes
  },
  {
    metrics: ['cpu.user', 'cpu.sys'],
    labels: [t('in-forge:plugins.process.user'), t('in-forge:plugins.process.system')],
    min: 0,
    category: [t('in-forge:plugins.process.cpuUsage')],
    formatter: percentage
  },
  {
    metrics: ['ctx_switches.voluntary', 'ctx_switches.nonvoluntary'],
    labels: [t('in-forge:plugins.process.voluntary'), t('in-forge:plugins.process.nonvoluntary')],
    min: 0,
    category: [t('in-forge:plugins.process.contextSwitches')],
    formatter: number
  },
  {
    metric: 'openFiles.current',
    label: t('in-forge:plugins.process.current'),
    category: [t('in-forge:plugins.process.openFiles')],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'openFiles.max']);
    },
    formatter: number
  },
  {
    metric: 'openFiles.used',
    label: t('in-forge:plugins.process.used'),
    category: [t('in-forge:plugins.process.openFiles')],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
