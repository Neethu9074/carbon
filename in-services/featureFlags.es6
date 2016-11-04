import {isInstanaTenant, isInternalEnvironment} from 'in-services/config';

export const webVrEnabled = isInstanaTenant();
export const isEumEnabled = isInstanaTenant() && isInternalEnvironment();
export const configurationViewEnabled = isInstanaTenant() && isInternalEnvironment();
