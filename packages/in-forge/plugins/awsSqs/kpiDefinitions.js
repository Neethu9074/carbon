/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds } from 'in-services/formatters/number';

export default [
  {
    label: 'Oldest Messages (Age)',
    metric: 'age_of_oldest_msg',
    formatter: seconds.fixedCompact
  },
  {
    label: 'Messages Delayed',
    metric: 'num_of_msg_delayed',
    formatter: number.compact
  }
];
