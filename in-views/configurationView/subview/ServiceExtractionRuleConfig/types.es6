import * as mbConfig from 'in-views/configurationView/subview/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import * as esConfig from 'in-views/configurationView/subview/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import * as httpConfig from 'in-views/configurationView/subview/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import * as ejbConfig from 'in-views/configurationView/subview/ServiceExtraction/configs/EjbServiceExtractionConfiguration';

export const typeDefinitions = {
  ejbServiceExtraction: ejbConfig,
  elasticsearchServiceExtraction: esConfig,
  httpServiceExtraction: httpConfig,
  messageBrokerServiceExtraction: mbConfig
};
