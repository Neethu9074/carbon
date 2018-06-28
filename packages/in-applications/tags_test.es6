/* eslint-env mocha, node */
import { expect } from 'chai';

import {
  getTreeNodesTillName,
  getFullPathTillNode,
  getDeepestPossibleNodePath,
  findChildByName,
  findSubTreeByFullyQualifiedName,
  getTagTree,
  clearTagTree,
  mapFromServerResponse,
  mapToServerResponse
} from 'in-applications/tags';

describe('in-applications/tags', () => {
  describe('mapFromServerResponse', () => {
    it('should do nothing of there is no data in the result', () => {
      const response = { foo: 'bar' };
      let mappedResult = mapFromServerResponse(response);
      expect(response).to.equal(mappedResult);
    });

    it('should ignore key which do not need a mapping', () => {
      const response = {
        data: {
          id: 1,
          label: 'foobar',
          matchSpecification: [
            {
              key: 'host.zone',
              value: 'foobar'
            }
          ]
        }
      };
      let mappedResult = mapFromServerResponse(response);
      expect(response.id).to.equal(mappedResult.id);
      expect(response.label).to.equal(mappedResult.label);
      expect(response.matchSpecification).to.equal(mappedResult.matchSpecification);
    });

    it('should map specific docker labels to docker.label', () => {
      const response = {
        data: {
          id: 1,
          label: 'foobar',
          matchSpecification: [
            {
              key: 'docker.label.ARTIFACT_ID',
              value: 'a'
            },
            {
              key: 'docker.label.ARTIFACT_VERSION',
              value: 'b'
            },
            {
              key: 'docker.label.com.amazonaws.ecs.cluster',
              value: 'c'
            },
            {
              key: 'docker.label.',
              value: 'd'
            }
          ]
        }
      };
      let mappedResult = mapFromServerResponse(response);
      expect(mappedResult.data.id).to.equal(1);
      expect(mappedResult.data.label).to.equal('foobar');
      expect(mappedResult.data.matchSpecification).to.deep.equal([
        {
          key: 'docker.label',
          value: 'ARTIFACT_ID=a'
        },
        {
          key: 'docker.label',
          value: 'ARTIFACT_VERSION=b'
        },
        {
          key: 'docker.label',
          value: 'com.amazonaws.ecs.cluster=c'
        },
        {
          key: 'docker.label',
          value: '=d'
        }
      ]);
    });

    it('should map specific host tags to docker.tag', () => {
      const response = {
        data: {
          id: 1,
          label: 'foobar',
          matchSpecification: [
            {
              key: 'agent.tag.foo',
              value: 'bar'
            },
            {
              key: 'agent.tag',
              value: 'a=b'
            },
            {
              key: 'agent.tag',
              value: 'c'
            }
          ]
        }
      };
      let mappedResult = mapFromServerResponse(response);
      expect(mappedResult.data.id).to.equal(1);
      expect(mappedResult.data.label).to.equal('foobar');
      expect(mappedResult.data.matchSpecification).to.deep.equal([
        {
          key: 'agent.tag',
          value: 'foo=bar'
        },
        {
          key: 'agent.tag',
          value: 'a=b'
        },
        {
          key: 'agent.tag',
          value: 'c'
        }
      ]);
    });
  });

  describe('mapToServerResponse', () => {
    it('should do nothing if there is are no matchSpecifications', () => {
      const config = {
        id: 1,
        label: 'foobar',
        matchSpecification: []
      };
      let mappedResult = mapToServerResponse(config);
      expect(config).to.equal(mappedResult);
    });

    it('should ignore key which do not need a mapping', () => {
      const config = {
        id: 1,
        label: 'foobar',
        matchSpecification: [
          {
            key: 'host.zone',
            value: 'foobar'
          }
        ]
      };
      let mappedResult = mapFromServerResponse(config);
      expect(config).to.equal(mappedResult);
    });

    it('should map specific docker.label to specific docker labels', () => {
      const config = {
        id: 1,
        label: 'foobar',
        matchSpecification: [
          {
            key: 'docker.label',
            value: 'ARTIFACT_ID=a'
          },
          {
            key: 'docker.label',
            value: 'ARTIFACT_VERSION=b'
          },
          {
            key: 'docker.label',
            value: 'com.amazonaws.ecs.cluster=c'
          },
          {
            key: 'docker.label',
            value: '=d'
          }
        ]
      };
      let mappedResult = mapToServerResponse(config);
      expect(mappedResult.id).to.equal(1);
      expect(mappedResult.label).to.equal('foobar');
      expect(mappedResult.matchSpecification).to.deep.equal([
        {
          key: 'docker.label.ARTIFACT_ID',
          value: 'a'
        },
        {
          key: 'docker.label.ARTIFACT_VERSION',
          value: 'b'
        },
        {
          key: 'docker.label.com.amazonaws.ecs.cluster',
          value: 'c'
        },
        {
          key: 'docker.label.',
          value: 'd'
        }
      ]);
    });

    it('should map specific kubernetes.pod.label to specific kubernetes pod labels', () => {
      const config = {
        id: 1,
        label: 'foobar',
        matchSpecification: [
          {
            key: 'kubernetes.pod.label',
            value: 'app=nginx'
          },
          {
            key: 'kubernetes.pod.label',
            value: '=d'
          }
        ]
      };
      let mappedResult = mapToServerResponse(config);
      expect(mappedResult.id).to.equal(1);
      expect(mappedResult.label).to.equal('foobar');
      expect(mappedResult.matchSpecification).to.deep.equal([
        {
          key: 'kubernetes.pod.label.app',
          value: 'nginx'
        },
        {
          key: 'kubernetes.pod.label.',
          value: 'd'
        }
      ]);
    });

    it('should map specific agent.tag to specific agent tags', () => {
      const config = {
        id: 1,
        label: 'foobar',
        matchSpecification: [
          {
            key: 'agent.tag',
            value: 'env=nginx'
          },
          {
            key: 'agent.tag',
            value: '=d'
          },
          {
            key: 'agent.tag',
            value: 'foobar'
          }
        ]
      };
      let mappedResult = mapToServerResponse(config);
      expect(mappedResult.id).to.equal(1);
      expect(mappedResult.label).to.equal('foobar');
      expect(mappedResult.matchSpecification).to.deep.equal([
        {
          key: 'agent.tag.env',
          value: 'nginx'
        },
        {
          key: 'agent.tag',
          value: 'd'
        },
        {
          key: 'agent.tag',
          value: 'foobar'
        }
      ]);
    });
  });

  describe('tag tree', () => {
    beforeEach(() => {
      clearTagTree();
      window.instana.tags = [
        { name: 'a.b.c' },
        { name: 'a.b.c.d' },
        { name: 'a.b' },
        { name: 'a.b.d' },
        { name: 'b' },
        { name: 'b.c.d' },
        { name: 'x.c.d' },
        { name: 'x.y.z' },
        { name: 'z.a.c' },
        { name: 'z.a.b' },
        { name: 'this.is.a.unique.path' }
      ];
    });

    it('should build a categorized tag tree', () => {
      const tree = getTagTree();

      expect(tree).to.not.equal(null);

      expect(tree.children).to.have.length(5);
      expect(tree.children[0].name).to.equal('a');
      expect(tree.children[1].name).to.equal('b');
      expect(tree.children[2].name).to.equal('this');
      expect(tree.children[3].name).to.equal('x');
      expect(tree.children[4].name).to.equal('z');

      expect(tree.children[0].children).to.have.length(1);
      expect(tree.children[0].children[0].name).to.equal('b');

      expect(tree.children[0].children[0].isTag).to.equal(true);
      expect(tree.children[0].children[0].children).to.have.length(2);
      expect(tree.children[0].children[0].children[0].name).to.equal('c');
      expect(tree.children[0].children[0].children[1].name).to.equal('d');

      expect(tree.children[0].children[0].children[0].isTag).to.equal(true);
      expect(tree.children[0].children[0].children[0].children).to.have.length(1);
      expect(tree.children[0].children[0].children[0].children[0].name).to.equal('d');

      expect(tree.children[1].isTag).to.equal(true);
      expect(tree.children[1].children).to.have.length(1);
      expect(tree.children[1].children[0].name).to.equal('c');

      expect(tree.children[1].children[0].children).to.have.length(1);
      expect(tree.children[1].children[0].children[0].name).to.equal('d');
    });

    // it('should deep merge keys', () => {
    //   window.instana.tags = [{ name: 'a.b.c.d' }, { name: 'b.c.d' }];
    //   const tree = getTagTree();

    //   expect(tree).to.not.equal(null);

    //   expect(tree.children).to.have.length(2);
    //   expect(tree.children[0].name).to.equal('a.b.c.d');
    //   expect(tree.children[1].name).to.equal('b.c.d');
    // });

    it('should find tree node by given fully qualified name', () => {
      expect(findSubTreeByFullyQualifiedName('a')).to.not.equal(null);

      let match = findSubTreeByFullyQualifiedName('a.b');
      expect(match).to.not.equal(null);
      expect(match.name).to.equal('b');
      expect(match.fullyQualifiedName).to.equal('a.b');

      match = findSubTreeByFullyQualifiedName('a.b.c.d');
      expect(match).to.not.equal(null);
      expect(match.name).to.equal('d');
      expect(match.fullyQualifiedName).to.equal('a.b.c.d');
    });

    it('should find tree node by given fully qualified name (findSubTreeByFullyQualifiedName)', () => {
      expect(findSubTreeByFullyQualifiedName('foo.bar')).to.equal(undefined);
      expect(findSubTreeByFullyQualifiedName('a.b.c').name).to.equal('c');
      expect(findSubTreeByFullyQualifiedName('a.b').name).to.equal('b');
      expect(findSubTreeByFullyQualifiedName('a.b.d').name).to.equal('d');
      expect(findSubTreeByFullyQualifiedName('b').name).to.equal('b');
      expect(findSubTreeByFullyQualifiedName('b.c.d').name).to.equal('d');
    });

    it('should find tree nodes till the given name', () => {
      expect(getTreeNodesTillName('foo.bar')).to.equal(null);
      expect(
        getTreeNodesTillName('a.b.c')
          .map(n => n.name)
          .join('.')
      ).to.equal('a.b.c');
      expect(getTreeNodesTillName('foo.bar')).to.equal(null);
      expect(
        getTreeNodesTillName('a.b.c.d')
          .map(n => n.name)
          .join('.')
      ).to.equal('a.b.c.d');
    });

    it('should return the full path till node (getFullPathTillNode)', () => {
      expect(getFullPathTillNode(findSubTreeByFullyQualifiedName('a.b.c.d'))).to.equal('a.b.c');
      expect(getFullPathTillNode(findSubTreeByFullyQualifiedName('a.b.c.d'), 'f')).to.equal('a.b.c.f');
      expect(getFullPathTillNode(findSubTreeByFullyQualifiedName('b'), 'f')).to.equal('f');
    });

    it('should resolve to the deepest possible node path (getDeepestPossibleNodePath)', () => {
      expect(getDeepestPossibleNodePath('unknown')).to.equal('unknown');
      expect(getDeepestPossibleNodePath('x')).to.equal('x');
      expect(getDeepestPossibleNodePath('a')).to.equal('a.b');
      expect(getDeepestPossibleNodePath('this.is.a.unique.path')).to.equal('this.is.a.unique.path');
    });

    it('should find child by name (findChildByName)', () => {
      expect(findChildByName(findSubTreeByFullyQualifiedName('unknown'), 'unknown')).to.equal(null);
      expect(findChildByName(findSubTreeByFullyQualifiedName('a.b'), 'unknown')).to.equal(null);
      expect(findChildByName(findSubTreeByFullyQualifiedName('a.b'), 'c').name).to.equal('c');
      expect(findChildByName(findSubTreeByFullyQualifiedName('this.is.a'), 'unique').name).to.equal('unique');
    });
  });
});
