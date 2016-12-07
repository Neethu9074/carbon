import {isInstanaTenant, isInternalEnvironment, isStagingEnvironment} from 'in-services/config';

const notStaging = !isStagingEnvironment();
const onlyInstana = isInstanaTenant();
const onlyInternally = onlyInstana && isInternalEnvironment();

export const webVrEnabled = notStaging && onlyInstana;
export const isEumEnabled = onlyInternally;
