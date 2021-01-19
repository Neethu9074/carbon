/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytesZeroDecimalPlaces, percentagePlain } from 'in-services/formatters/number';

export default [
  {
    metric: 'connectedclients',
    label: 'Connected Clients',
    category: ['Performance'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'totalcommandsprocessed',
    label: 'Total Operations',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'cachehits',
    label: 'Cache Hits',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'cachemisses',
    label: 'Cache Misses',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'getcommands',
    label: 'Gets',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'setcommands',
    label: 'Sets',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'operationsPerSecond',
    label: 'Operations Per Second',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'evictedkeys',
    label: 'Evicted Keys',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'totalkeys',
    label: 'Total Keys',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'expiredkeys',
    label: 'Expired Keys',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'usedmemory',
    label: 'Used Memory',
    category: ['Performance'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'usedmemorypercentage',
    label: 'Percentage of Memory Used',
    min: 0,
    formatter: percentagePlain
  },
  {
    metric: 'usedmemoryRss',
    label: 'Used Memory RSS',
    category: ['Performance'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'serverLoad',
    label: 'Server Load',
    category: ['Performance'],
    min: 0,
    formatter: percentage
  },
  {
    metric: 'cacheWrite',
    label: 'Cache Write',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'cacheRead',
    label: 'Cache Read',
    category: ['Traffic'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'percentProcessorTime',
    label: 'CPU',
    category: ['Performance'],
    min: 0,
    formatter: percentage
  }
];
