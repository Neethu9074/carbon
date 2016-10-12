import {isInternalEnvironment} from 'in-services/config';

export const eumTracingEnabled = isInternalEnvironment();
export const newIncidentViewEnabled = isInternalEnvironment();
