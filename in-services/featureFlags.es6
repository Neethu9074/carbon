import {isInstanaTenant} from 'in-services/config';

export const webVrEnabled = isInstanaTenant();
export const isEumEnabled = isInstanaTenant();
export const configurationViewEnabled = isInstanaTenant();
