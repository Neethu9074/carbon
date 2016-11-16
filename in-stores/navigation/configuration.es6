import {buildUrlStream, buildPathStartsWithStream} from 'in-stores/navigation/navigation';

export const configurationViewLink$ = buildUrlStream({path: '/config'});

const httpServiceExtractionConfigViewPath = '/config/httpServiceExtraction';
export const httpServiceExtractionConfigurationViewLink$ = buildUrlStream({path: httpServiceExtractionConfigViewPath});
export const isHttpServiceExtractionConfigurationView$ = buildPathStartsWithStream(httpServiceExtractionConfigViewPath);

const userInterfaceConfigViewPath = '/config/userInterface';
export const userInterfaceConfigViewLink$ = buildUrlStream({path: userInterfaceConfigViewPath});
export const isUserInterfaceConfigView$ = buildPathStartsWithStream(userInterfaceConfigViewPath);
