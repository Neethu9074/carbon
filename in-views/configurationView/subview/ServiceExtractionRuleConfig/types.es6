import * as mbConfig
  from 'in-views/configurationView/subview/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import * as esConfig
  from 'in-views/configurationView/subview/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import * as httpConfig
  from 'in-views/configurationView/subview/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import * as ejbConfig
  from 'in-views/configurationView/subview/ServiceExtraction/configs/EjbServiceExtractionConfiguration';
import * as eumConfig
  from 'in-views/configurationView/subview/ServiceExtraction/configs/EumServiceExtractionConfiguration';

export const typeDefinitions = {
  ejb: ejbConfig,
  elasticsearchindex: esConfig,
  webapp: httpConfig,
  messagebroker: mbConfig,
  browser: eumConfig
};
