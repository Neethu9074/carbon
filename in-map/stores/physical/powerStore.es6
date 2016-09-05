import createCollection from 'in-map/stores/ObjectColletionStream';
import {POWER_CHECKING} from 'in-map/misc/TimingConfig';


export const powers = createCollection();
export const maxPower$ = powers.stream.throttle(POWER_CHECKING)
                                      .map(_powers => Object.keys(_powers).map(key => _powers[key])
                                                                          .reduce(powerReducer, 0));

function powerReducer(maxPower, power) {
  return Math.max(maxPower, power);
}
