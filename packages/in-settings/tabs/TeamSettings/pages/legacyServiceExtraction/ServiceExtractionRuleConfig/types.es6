import * as mbConfig from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import * as generalConfig from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import * as batchConfig from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/BatchServiceExtractionConfiguration';
import * as esConfig from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import * as httpConfig from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import * as ejbConfig from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/EjbServiceExtractionConfiguration';

export const typeDefinitions = {
  generalServiceExtraction: generalConfig,
  ejbServiceExtraction: ejbConfig,
  elasticsearchServiceExtraction: esConfig,
  httpServiceExtraction: httpConfig,
  messageBrokerServiceExtraction: mbConfig,
  batchServiceExtraction: batchConfig
};
