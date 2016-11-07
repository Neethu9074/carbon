import {isInstanaTenant, isInternalEnvironment} from 'in-services/config';

const onlyInternally = isInstanaTenant() && isInternalEnvironment();

export const webVrEnabled = isInstanaTenant();
export const isEumEnabled = onlyInternally;
export const configurationViewEnabled = onlyInternally;
export const applyTimeButtonEnabled = onlyInternally;
export const alternativeLogicalLayouting = onlyInternally;
