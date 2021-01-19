/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createCollection from 'in-map/stores/ObjectCollectionStream';
import { POWER_CHECKING } from 'in-map/misc/TimingConfig';

export const powers = createCollection();
export const maxPower$ = powers.stream.throttle(POWER_CHECKING).map(_powers => {
  let maxPower = 0;
  _powers.forEach(power => (maxPower = Math.max(power, maxPower)));
  return maxPower;
});
