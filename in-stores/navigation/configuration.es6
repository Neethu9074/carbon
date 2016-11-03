import {buildUrlStream, buildPathStartsWithStream} from 'in-stores/navigation/navigation';

export const configurationViewLink$ = buildUrlStream({path: '/config'});

const httpServiceExtrationConfigViewPath = '/config/httpServiceExtration';
export const httpServiceExtrationConfigurationViewLink$ = buildUrlStream({path: httpServiceExtrationConfigViewPath});
export const isHttpServiceExtrationConfigurationView$ = buildPathStartsWithStream(httpServiceExtrationConfigViewPath);
