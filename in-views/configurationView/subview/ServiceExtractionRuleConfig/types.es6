import * as ejbConfig from 'in-views/configurationView/subview/EjbServiceExtractionConfiguration';
import * as httpConfig from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration';
import * as esConfig from 'in-views/configurationView/subview/ElasticServiceExtractionConfiguration';
import * as mbConfig from 'in-views/configurationView/subview/MessageBrokerServiceExtractionConfiguration';

export const typeDefinitions = {
  ejb: ejbConfig,
  elasticsearchindex: esConfig,
  webapp: httpConfig,
  messagebroker: mbConfig
};
