/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hiddenSearchFieldValues, getHiddenSearchFieldKeywords } from 'in-services/featureFlags';
import { filters$ } from 'in-components/SearchBar/stores/filters';
import { requiresQuotes } from 'in-stores/search/manipulation';
import { emptyArray } from 'in-services/fixedObjects';
import { find } from 'in-services/arrayUtils';

export const aliasMap = {};

const helpTexts = {
  entity: 'Infrastructure and application entity',
  'entity.agent': 'Instana Agent',
  'entity.agent.gitops': 'Instana Agent GitOps configuration',
  'entity.aws': 'Amazon Web Services',
  'entity.aws.beanstalk': 'Elastic Beanstalk',
  'entity.aws.elb': 'Elastic Load Balancing',
  'entity.aws.rds': 'Relational Database Service',
  'entity.aws.s3': 'Simple Storage Service',
  'entity.aws.ebs': 'Elastic Block Storage',
  'entity.aws.mq': 'Elastic MQ',
  'entity.aws.emr': 'Elastic MapReduce',
  'entity.aws.lambda': 'AWS Lambda',
  'entity.azure': 'Microsoft Azure',
  'entity.azure.service': 'Microsoft Azure services',
  'entity.azure.service.apim': 'Azure API Management',
  'entity.azure.service.apim.api': 'Azure API Management Service API',
  'entity.azure.service.appservice': 'Azure App Service',
  'entity.azure.service.cosmosdb': 'Azure CosmosDB',
  'entity.azure.service.rediscache': 'Azure Redis Cache',
  'entity.azure.service.sqldb': 'Azure SQL Database',
  'entity.azure.service.sqlelasticpool': 'Azure SQL Elastic Pool',
  'entity.azure.service.sqlserver': 'Azure SQL Server',
  'entity.azure.service.storage': 'Azure Storage',
  'entity.host': 'Infrastructure host',
  'entity.host.os': 'Operating system',
  'entity.ibmMq': 'IBM MQ',
  'entity.ibmMq.cluster': 'IBM MQ Cluster',
  'entity.ibmMq.qm': 'IBM MQ Queue Manager',
  'entity.ibmMq.queue': 'IBM MQ Queue',
  'entity.ibmMq.channel': 'IBM MQ Channel',
  'entity.service': 'Logical service',
  'entity.containerd': 'Containerd container',
  'entity.crio': 'CRI-O container',
  'entity.docker': 'Docker container',
  'entity.garden': 'Garden container',
  'entity.lxc': 'LXC container',
  'entity.ruby': 'Ruby application',
  'entity.jvm': 'Java virtual machine',
  'entity.jvm.app': 'JVM based application',
  'entity.weblogic': 'Oracle WebLogic server',
  'entity.nodejs': 'Node.js runtime and application',
  'entity.nodejs.app': 'Node.js application',
  'entity.ec2': 'Amazon EC2',
  'entity.dropwizard': 'Dropwizard application',
  'entity.elasticsearch': 'Elasticsearch database',
  'entity.elasticsearch.cluster': 'Elasticsearch cluster',
  'entity.marathon': 'Mesosphere Marathon',
  'entity.process': 'Operating system process',
  'entity.pingdirectory': 'PingIdentity Directory server',
  'entity.jboss': 'JBoss application server',
  'entity.tomcat': 'Apache Tomcat',
  'entity.nomad': 'HashiCorp Nomad scheduler',
  'entity.gce': 'Google Compute Engine',
  'entity.gcp': 'Google Cloud Platform',
  'entity.gcp.datastore': 'Google Cloud Datastore',
  'entity.gcp.pubsub': 'Google Cloud Pub/Sub',
  'entity.gcp.sql': 'Google Cloud SQL',
  'entity.gcp.storage': 'Google Cloud Storage',
  'entity.vsphere.datacenter': 'vSphere Datacenter',
  'entity.vsphere.esxihost': 'vSphere ESXi Host',
  'entity.vsphere.vm': 'vSphere Virtual Machine',
  'entity.websphere': 'IBM WebSphere application server',
  trace: 'Trace and root span',
  event: 'Changes, issues and incidents',
  span: 'Spans within traces',
  'span.website': 'Web end-user monitoring',
  'span.website.geo': 'Geolocation based on IP',
  'span.website.error': 'Uncaught errors',
  'span.website.timing': 'Navigation timing',
  'span.website.resource': 'Resource timing',
  'span.website.userAgent': 'User Agent',
  'span.website.userAgent.os': 'Operating System',
  'span.website.userAgent.browser': 'Web Browser',
  'span.endpoint': 'Endpoint specific fields'
};

const filterNode = node('filter', { description: 'Saved filter' });
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
