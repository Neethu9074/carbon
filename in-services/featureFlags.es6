import {isInternalEnvironment, isInstanaTenant} from 'in-services/config';

export const eumTracingEnabled = isInternalEnvironment();
export const webVrEnabled = isInstanaTenant();
