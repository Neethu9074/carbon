import {isInstanaTenant, /* isInternalEnvironment, */ isStagingEnvironment} from 'in-services/config';

const notStaging = !isStagingEnvironment();
const onlyInstana = isInstanaTenant();

export const webVrEnabled = notStaging && onlyInstana;
