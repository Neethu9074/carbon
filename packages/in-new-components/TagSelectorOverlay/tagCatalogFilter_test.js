import { expect } from 'chai';

import filterCatalog from 'in-new-components/TagSelectorOverlay/tagCatalogFilter';

/* eslint-env mocha */

describe('in-new-components/QueryBuilder/TagSelectorOverlay/tagCatalogFilter', () => {
  it('should return the whole tree if the query is empty', () => {
    expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, ''))).to.deep.equal(exampleCatalog);
  });

  it('should filter by group level', () => {
    expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Kubernetes'))).to.deep.equal({
      tags: [],
      tagTree: [
        kubernetesGroup([
          clusterSubGroup([clusterLabel, clusterName]),
          namespaceSubGroup([namespaceLabel, namespaceName])
        ])
      ]
    });

    expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Application'))).to.deep.equal({
      tags: [],
      tagTree: [applicationGroup([applicationSubGroup([applicationName]), serviceSubGroup([serviceName])])]
    });
  });

  it('should filter by sub-group level', () => {
    expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Cluster'))).to.deep.equal({
      tags: [],
      tagTree: [kubernetesGroup([clusterSubGroup([clusterLabel, clusterName])])]
    });

    expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Namespace'))).to.deep.equal({
      tags: [],
      tagTree: [kubernetesGroup([namespaceSubGroup([namespaceLabel, namespaceName])])]
    });

    expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Service'))).to.deep.equal({
      tags: [],
      tagTree: [applicationGroup([serviceSubGroup([serviceName])])]
    });
  });

  describe('', () => {
    it('should filter by tag level', () => {
      expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Label'))).to.deep.equal({
        tags: [],
        tagTree: [kubernetesGroup([clusterSubGroup([clusterLabel]), namespaceSubGroup([namespaceLabel])])]
      });

      expect(deleteOriginalChildrenForTestingPurposes(filterCatalog(exampleCatalog, 'Name'))).to.deep.equal({
        tags: [],
        tagTree: [
          kubernetesGroup([clusterSubGroup([clusterName]), namespaceSubGroup([namespaceLabel, namespaceName])]),
          applicationGroup([applicationSubGroup([applicationName]), serviceSubGroup([serviceName])])
        ]
      });
    });
  });
});

const clusterLabel = {
  type: 'TAG',
  label: 'Label',
  icon: 'lib_kubernetes_label',
  description: 'Key/Value - Defined in Kubernetes',
  tagName: 'kubernetes.cluster.label'
};

const clusterName = {
  type: 'TAG',
  label: 'Name',
  icon: 'lib_kubernetes_label',
  description: 'String - Cluster´s name',
  tagName: 'kubernetes.cluster.name'
};

const clusterSubGroup = children => ({
  type: 'LEVEL',
  label: 'Cluster',
  icon: 'lib_kubernetes_cluster',
  children
});
const namespaceLabel = {
  type: 'TAG',
  label: 'Label',
  icon: 'lib_kubernetes_label',
  description: 'Key/Value - Defined in Kubernetes',
  tagName: 'kubernetes.namespace.label'
};

const namespaceName = {
  type: 'TAG',
  label: 'Name',
  icon: 'lib_kubernetes_label',
  description: 'String - Namespace´s name',
  tagName: 'kubernetes.namespace.name'
};

const namespaceSubGroup = children => ({
  type: 'LEVEL',
  label: 'Namespace',
  icon: 'lib_kubernetes_namespace',
  children
});

const kubernetesGroup = children => ({
  type: 'LEVEL',
  label: 'Kubernetes',
  children
});

const applicationName = {
  type: 'TAG',
  label: 'Name',
  icon: 'lib_views_tag',
  description: 'String - Application´s name',
  tagName: 'application.name'
};

const applicationSubGroup = children => ({
  type: 'LEVEL',
  label: 'Application Perspective',
  icon: 'lib_application',
  children
});
const serviceName = {
  type: 'TAG',
  label: 'Name',
  icon: 'lib_views_tag',
  description: 'String - Service´s name',
  tagName: 'service.name'
};

const serviceSubGroup = children => ({
  type: 'LEVEL',
  label: 'Service',
  icon: 'lib_application_service',
  children
});
const applicationGroup = children => ({
  type: 'LEVEL',
  label: 'Application',
  children
});

const exampleCatalog = {
  tags: [],
  tagTree: [
    kubernetesGroup([clusterSubGroup([clusterLabel, clusterName]), namespaceSubGroup([namespaceLabel, namespaceName])]),
    applicationGroup([applicationSubGroup([applicationName]), serviceSubGroup([serviceName])])
  ]
};

function deleteOriginalChildrenForTestingPurposes(tagCatalog) {
  tagCatalog.tagTree.forEach(deleteOriginalChildrenForTestingPurposesFromNode);
  return tagCatalog;
}

function deleteOriginalChildrenForTestingPurposesFromNode(node) {
  delete node.originalChildren;
  node.children?.forEach(deleteOriginalChildrenForTestingPurposesFromNode);
}
