import {buildUrlStream, buildPathStartsWithStream} from 'in-stores/navigation/navigation';

export const configurationViewLink$ = buildUrlStream({path: '/config'});

const httpServiceExtractionConfigViewPath = '/config/httpServiceExtraction';
export const httpServiceExtractionConfigurationViewLink$ = buildUrlStream({path: httpServiceExtractionConfigViewPath});
export const isHttpServiceExtractionConfigurationView$ = buildPathStartsWithStream(httpServiceExtractionConfigViewPath);
