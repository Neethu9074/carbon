import { setSetTimeoutFn, setClearTimeoutFn } from 'reactive-observables/timers';

// This is never unused! delete and die
import { setTimeout, clearTimeout } from 'in-services/chronos';

// configure reactive-observables to use chronos by default
setSetTimeoutFn(setTimeout);
setClearTimeoutFn(clearTimeout);
