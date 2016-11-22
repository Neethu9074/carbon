import {isInstanaTenant, isInternalEnvironment} from 'in-services/config';

const onlyInstana = isInstanaTenant();
const onlyInternally = onlyInstana && isInternalEnvironment();

export const webVrEnabled = onlyInstana;
export const isEumEnabled = onlyInternally;
export const provideAlternativeLogicalLayouter = onlyInstana;
