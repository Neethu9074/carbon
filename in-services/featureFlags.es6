import {isInstanaTenant, /* isInternalEnvironment, */ isStagingEnvironment} from 'in-services/config';

const notStaging = !isStagingEnvironment();
const onlyInstana = isInstanaTenant();

export const webVrEnabled = notStaging && onlyInstana;
export const eumStatisticsEnabled = notStaging && onlyInstana;
export const logViewEnabled = notStaging && onlyInstana;
export const agentYamlConfigEnabled = notStaging && onlyInstana;
