/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { hiddenSearchFieldValues, getHiddenSearchFieldKeywords } from 'in-services/featureFlags';
import { filters$ } from 'in-components/SearchBar/stores/filters';
import { requiresQuotes } from 'in-stores/search/manipulation';
import { emptyArray } from 'in-services/fixedObjects';
import { find } from 'in-services/arrayUtils';
import { t } from 'in-i18n';

export const aliasMap = {};

const helpTexts = {
  entity: t('in-stores:search.fieldsEntity'),
  'entity.agent': t('in-stores:search.fieldsEntityAgent'),
  'entity.agent.gitops': t('in-stores:search.fieldsEntityAgentGitops'),
  'entity.aws': t('in-stores:search.fieldsEntityAws'),
  'entity.aws.beanstalk': t('in-stores:search.fieldsEntityAwsBeanstalk'),
  'entity.aws.cloudfront': t('in-stores:search.fieldsEntityAwsCloudFront'),
  'entity.aws.elb': t('in-stores:search.fieldsEntityAwsElb'),
  'entity.aws.rds': t('in-stores:search.fieldsEntityAwsRds'),
  'entity.aws.s3': t('in-stores:search.fieldsEntityAwsS3'),
  'entity.aws.ebs': t('in-stores:search.fieldsEntityAwsEbs'),
  'entity.aws.msk': t('in-stores:search.fieldsEntityAwsMsk'),
  'entity.aws.msk.broker': t('in-stores:search.fieldsEntityAwsMskBroker'),
  'entity.aws.mq': t('in-stores:search.fieldsEntityAwsMq'),
  'entity.aws.emr': t('in-stores:search.fieldsEntityAwsEmr'),
  'entity.aws.lambda': t('in-stores:search.fieldsEntityAwsLambda'),
  'entity.aws.ecs': t('in-stores:search.fieldsEntityAwsEcs'),
  'entity.aws.apigateway': t('in-stores:search.fieldsEntityAwsApiGateway'),
  'entity.aws.appsync': t('in-stores:search.fieldsEntityAwsAppSync'),
  'entity.aws.autoscaling': t('in-stores:search.fieldsEntityAwsAutoScaling'),
  'entity.aws.timestream': t('in-stores:search.fieldsEntityAwsTimestream'),
  'entity.aws.iotcore': t('in-stores:search.fieldsEntityAwsIotCore'),
  'entity.azure': t('in-stores:search.fieldsEntityAzure'),
  'entity.aws.redshift': t('in-stores:search.fieldsEntityAwsRedshift'),
  'entity.aws.redshift.cluster': t('in-stores:search.fieldsEntityAwsRedshiftCluster'),
  'entity.aws.redshift.node': t('in-stores:search.fieldsEntityAwsRedshiftNode'),
  'entity.aws.documentdb': t('in-stores:search.fieldsEntityAwsDocumentdb'),
  'entity.aws.documentdb.cluster': t('in-stores:search.fieldsEntityAwsDocumentdbCluster'),
  'entity.aws.documentdb.instance': t('in-stores:search.fieldsEntityAwsDocumentdbInstance'),
  'entity.aws.documentdb.elastic.cluster': t('in-stores:search.fieldsEntityAwsDocumentdbElasticCluster'),
  'entity.aws.sns': t('in-stores:search.fieldsEntityAwsSns'),
  'entity.azure.service': t('in-stores:search.fieldsEntityAzureService'),
  'entity.azure.service.apim': t('in-stores:search.fieldsEntityAzureServiceApim'),
  'entity.azure.service.apim.api': t('in-stores:search.fieldsEntityAzureServiceApimApi'),
  'entity.azure.service.appservice': t('in-stores:search.fieldsEntityAzureServiceAppservice'),
  'entity.azure.service.datafactory': t('in-stores:search.fieldsEntityAzureServiceDataFactory'),
  'entity.azure.service.keyvault': t('in-stores:search.fieldsEntityAzureServiceKeyVault'),
  'entity.azure.service.mysql': t('in-stores:search.fieldsEntityAzureServiceMySql'),
  'entity.azure.service.cosmosdb': t('in-stores:search.fieldsEntityAzureServiceCosmosdb'),
  'entity.azure.service.rediscache': t('in-stores:search.fieldsEntityAzureServiceRediscache'),
  'entity.azure.service.sqldb': t('in-stores:search.fieldsEntityAzureServiceSqldb'),
  'entity.azure.service.sqlelasticpool': t('in-stores:search.fieldsEntityAzureServiceSqlelasticpool'),
  'entity.azure.service.sqlserver': t('in-stores:search.fieldsEntityAzureServiceSqlserver'),
  'entity.azure.service.storage': t('in-stores:search.fieldsEntityAzureServiceStorage'),
  'entity.azure.service.databricks': t('in-stores:search.fieldsEntityAzureDatabricks'),
  'entity.azure.service.storage.queue': t('in-stores:search.fieldsEntityAzureServiceStorageQueue'),
  'entity.azure.service.storage.blob': t('in-stores:search.fieldsEntityAzureServiceStorageBlob'),
  'entity.azure.service.servicebus': t('in-stores:search.fieldsEntityAzureServiceBus'),
  'entity.azure.service.servicebus.queues': t('in-stores:search.fieldsEntityAzureServiceBusQueues'),
  'entity.azure.service.servicebus.topics': t('in-stores:search.fieldsEntityAzureServiceBusTopics'),
  'entity.azure.service.machinelearning': t('in-stores:search.fieldsEntityAzureMachineLearning'),
  'entity.azure.service.managedhsm': t('in-stores:search.fieldsEntityAzureKeyVaultManagedHSM'),
  'entity.azure.service.purview': t('in-stores:search.fieldsEntityAzureServicePurview'),
  'entity.azure.service.postgresql': t('in-stores:search.fieldsEntityAzureServicePostgreSQL'),
  'entity.azure.service.loadbalancer': t('in-stores:search.fieldsEntityAzureLoadBalancer'),
  'entity.azure.service.signalr': t('in-stores:search.fieldsEntityAzureSignalR'),
  'entity.azure.service.applicationgateway': t('in-stores:search.fieldsEntityAzureApplicationGateway'),
  'entity.host': t('in-stores:search.fieldsEntityHost'),
  'entity.host.os': t('in-stores:search.fieldsEntityHostOs'),
  'entity.ibmMq': t('in-stores:search.fieldsEntityIbmMq'),
  'entity.ibmMq.cluster': t('in-stores:search.fieldsEntityIbmMqCluster'),
  'entity.ibmMq.qm': t('in-stores:search.fieldsEntityIbmMqQm'),
  'entity.ibmMq.queue': t('in-stores:search.fieldsEntityIbmMqQueue'),
  'entity.ibmMq.channel': t('in-stores:search.fieldsEntityIbmMqChannel'),
  'entity.ibmMqMft.queuemanager': t('in-stores:search.fieldsEntityIbmMqMftCoordiQmgr'),
  'entity.ibmMqMft.zone': t('in-stores:search.fieldsEntityIbmMqMftZone'),
  'entity.ibmMqMft.agent': t('in-stores:search.fieldsEntityIbmMqMftAgent'),
  'entity.ibmMqMft.monitor': t('in-stores:search.fieldsEntityIbmMqMftMonitor'),
  'entity.service': t('in-stores:search.fieldsEntityService'),
  'entity.containerd': t('in-stores:search.fieldsEntityContainerd'),
  'entity.crio': t('in-stores:search.fieldsEntityCrio'),
  'entity.podman': t('in-stores:search.fieldsEntityPodman'),
  'entity.docker': t('in-stores:search.fieldsEntityDocker'),
  'entity.garden': t('in-stores:search.fieldsEntityGarden'),
  'entity.lxc': t('in-stores:search.fieldsEntityLxc'),
  'entity.ruby': t('in-stores:search.fieldsEntityRuby'),
  'entity.jvm': t('in-stores:search.fieldsEntityJvm'),
  'entity.jvm.app': t('in-stores:search.fieldsEntityJvmApp'),
  'entity.weblogic': t('in-stores:search.fieldsEntityWeblogic'),
  'entity.nodejs': t('in-stores:search.fieldsEntityNodejs'),
  'entity.nodejs.app': t('in-stores:search.fieldsEntityNodejsApp'),
  'entity.ec2': t('in-stores:search.fieldsEntityEc2'),
  'entity.dropwizard': t('in-stores:search.fieldsEntityDropwizard'),
  'entity.elasticsearch': t('in-stores:search.fieldsEntityElasticsearch'),
  'entity.elasticsearch.cluster': t('in-stores:search.fieldsEntityElasticsearchCluster'),
  'entity.marathon': t('in-stores:search.fieldsEntityMarathon'),
  'entity.process': t('in-stores:search.fieldsEntityProcess'),
  'entity.pingdirectory': t('in-stores:search.fieldsEntityPingdirectory'),
  'entity.jboss': t('in-stores:search.fieldsEntityJboss'),
  'entity.tomcat': t('in-stores:search.fieldsEntityTomcat'),
  'entity.tuxedo.domain': t('in-stores:search.fieldsEntityTuxedoDomain'),
  'entity.tuxedo.machine': t('in-stores:search.fieldsEntityTuxedoMachine'),
  'entity.tuxedo.server': t('in-stores:search.fieldsEntityTuxedoServer'),
  'entity.tuxedo.ipcqueue': t('in-stores:search.fieldsEntityTuxedoIpcQueue'),
  'entity.nomad': t('in-stores:search.fieldsEntityNomad'),
  'entity.gce': t('in-stores:search.fieldsEntityGce'),
  'entity.gcp': t('in-stores:search.fieldsEntityGcp'),
  'entity.gcp.datastore': t('in-stores:search.fieldsEntityGcpDatastore'),
  'entity.gcp.pubsub': t('in-stores:search.fieldsEntityGcpPubsub'),
  'entity.gcp.sql': t('in-stores:search.fieldsEntityGcpSql'),
  'entity.gcp.storage': t('in-stores:search.fieldsEntityGcpStorage'),
  'entity.vsphere.datacenter': t('in-stores:search.fieldsEntityVsphereDatacenter'),
  'entity.vsphere.esxihost': t('in-stores:search.fieldsEntityVsphereEsxihost'),
  'entity.vsphere.vm': t('in-stores:search.fieldsEntityVsphereVm'),
  'entity.websphere': t('in-stores:search.fieldsEntityWebsphere'),
  'entity.webspheredmgr.dmgr': t('in-stores:search.fieldsEntityWebsphereDeploymentManager'),
  trace: t('in-stores:search.fieldsTrace'),
  event: t('in-stores:search.fieldsEvent'),
  span: t('in-stores:search.fieldsSpan'),
  'span.website': t('in-stores:search.fieldsSpanWebsite'),
  'span.website.geo': t('in-stores:search.fieldsSpanWebsiteGeo'),
  'span.website.error': t('in-stores:search.fieldsSpanWebsiteError'),
  'span.website.timing': t('in-stores:search.fieldsSpanWebsiteTiming'),
  'span.website.resource': t('in-stores:search.fieldsSpanWebsiteResource'),
  'span.website.userAgent': t('in-stores:search.fieldsSpanWebsiteUserAgent'),
  'span.website.userAgent.os': t('in-stores:search.fieldsSpanWebsiteUserAgentOs'),
  'span.website.userAgent.browser': t('in-stores:search.fieldsSpanWebsiteUserAgentBrowser'),
  'span.endpoint': t('in-stores:search.fieldsSpanEndpoint')
};

const filterNode = node('filter', { description: t('in-stores:search.fieldsSavedFilter') });
filters$.subscribe(_filters => {
  filterNode.children = _filters.toArray().map(_filter =>
    node(_filter.get('name'), {
      isPreset: true,
      query: _filter.get('definition'),
      description: _filter.get('definition')
    })
  );
});

let treeBySearchContext = {};

export function getTree(searchContext) {
  if (!(searchContext in treeBySearchContext)) {
    const fields = buildCategorizedFields(searchContext);
    treeBySearchContext[searchContext] = fields;
  }
  return treeBySearchContext[searchContext];
}

export function node(name, props = {}) {
  return {
    name,
    description: props.description || helpTexts[props.path],
    children: props.children || {},
    isPreset: props.isPreset || false,
    parentNode: props.parentNode,
    query: props.query || (requiresQuotes(name) ? `"${name}"` : name),
    termType: props.termType
  };
}

export function buildCategorizedFields(searchContext, fields) {
  const root = node('root');
  fields = fields || getGlobalFields(searchContext);
  const hiddenSearchFieldKeywords = getHiddenSearchFieldKeywords(searchContext);

  fields.forEach(field => {
    for (let i = 0, length = hiddenSearchFieldKeywords.length; i < length; i++) {
      if (field.keyword.indexOf(hiddenSearchFieldKeywords[i]) === 0) {
        return;
      }
    }

    const path = field.keyword.split('.');
    aliasMap[field.keyword] = true;

    let currentNode = root;
    let completePath = '';

    for (let i = 0, length = path.length - 1; i < length; i++) {
      const pathPart = path[i];
      completePath += pathPart;
      if (!currentNode.children[pathPart]) {
        currentNode.children[pathPart] = node(pathPart, {
          path: completePath,
          parentNode: currentNode,
          numChildren: Object.keys(currentNode.children).length
        });
      }
      completePath += '.';
      currentNode = currentNode.children[pathPart];
    }

    const lastPart = path[path.length - 1];
    currentNode.children[lastPart] = node(lastPart, {
      description: field.description,
      parentNode: currentNode,
      termType: field.termType
    });
  });
  root.children[filterNode.name] = filterNode;

  mapChildrenObjectsToArrays(root);
  clearNode(root);

  // workaround needed to make the fields_test run sucessfully, which calls this
  // method explicitly to override the available search fields
  treeBySearchContext[searchContext] = root;

  return root;
}

function mapChildrenObjectsToArrays(node) {
  node.children = Object.keys(node.children)
    .map(key => node.children[key])
    .sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0, length = node.children.length; i < length; i++) {
    mapChildrenObjectsToArrays(node.children[i]);
  }
}

function clearNode(node) {
  if (node.children.length === 0) {
    return;
  }
  const filteredChildren = node.children.filter(n => n.termType !== 'id');
  if (filteredChildren.length === 0) {
    // kill node which only has termType-id child nodes
    if (node.parentNode) {
      node.parentNode.children = node.parentNode.children.filter(child => child.name !== node.name);
    }
  }
  for (let i = 0, length = filteredChildren.length; i < length; i++) {
    clearNode(filteredChildren[i]);
  }
}

export function findNode(query, searchContext) {
  const root = getTree(searchContext);
  if (!query || query.length === 0) {
    return root;
  }

  return findInNode(root, query);
}

function findInNode(node, query) {
  if (!node) {
    return null;
  }

  const path = query.split('.');
  const currentPart = path[0];

  for (let i = 0, length = node.children.length; i < length; i++) {
    const child = node.children[i];
    // path.length is only > 1 if the the query contains a '.'
    if (child.name === currentPart && path.length > 1) {
      return findInNode(child, query.substring(currentPart.length + 1));
    }
  }

  // if the user presses dot (.) but the previous string hasn't matched anything, return only directly matching results
  const children =
    path.length > 1
      ? node.children.filter(child => child.name === currentPart)
      : node.children.filter(child => child.name.indexOf(currentPart) >= 0);
  return children.length === 0 ? null : node;
}

export const operatorTree = node('root', {
  children: [node('AND', { isPreset: true }), node('OR', { isPreset: true }), node('NOT', { isPreset: true })]
});

export function getValueSuggestions(keyword, currentValue, searchContext) {
  const fields = getGlobalFields(searchContext);
  const field = find(fields, field => field.keyword === keyword);
  if (!field) {
    return emptyArray;
  }

  const values = field.fixedValues.filter(
    value => !hiddenSearchFieldValues[keyword] || hiddenSearchFieldValues[keyword].indexOf(value) === -1
  );

  // also empty string should lead to all values
  if (!currentValue) {
    return values;
  }

  return values
    .filter(value => value.indexOf(currentValue) === 0)
    .filter(value => !hiddenSearchFieldValues[keyword] || hiddenSearchFieldValues[keyword].indexOf(value) === -1);
}

function getGlobalFields(searchContext) {
  const fieldsKey = searchContext == 'traces' ? 'v2-traceList' : 'v2';
  return window.instana.searchFields[fieldsKey];
}
