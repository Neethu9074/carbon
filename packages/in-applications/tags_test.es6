/* eslint-env mocha, node */
import { expect } from 'chai';

import {
  findSubTreeByFullyQualifiedName,
  mapFromServerResponse,
  mapToServerResponse,
  getTagFromList
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

    it('should find tree node by given fully qualified name', () => {
      expect(findSubTreeByFullyQualifiedName('a')).to.equal(undefined);

      let match = findSubTreeByFullyQualifiedName('a.b');
      expect(match).to.not.equal(null);
      expect(match.fullyQualifiedName).to.equal('a.b');

      match = findSubTreeByFullyQualifiedName('a.b.c.d');
      expect(match).to.not.equal(null);
      expect(match.fullyQualifiedName).to.equal('a.b.c.d');
    });

    it('should find tree node by given fully qualified name (findSubTreeByFullyQualifiedName)', () => {
      expect(findSubTreeByFullyQualifiedName('foo.bar')).to.equal(undefined);
      expect(findSubTreeByFullyQualifiedName('a.b.c').name).to.equal('a.b.c');
      expect(findSubTreeByFullyQualifiedName('a.b').name).to.equal('a.b');
      expect(findSubTreeByFullyQualifiedName('a.b.d').name).to.equal('a.b.d');
      expect(findSubTreeByFullyQualifiedName('b').name).to.equal('b');
      expect(findSubTreeByFullyQualifiedName('b.c.d').name).to.equal('b.c.d');
    });
  });

  describe('tag tree', () => {
    const list = [
      { name: 'name1', value: 'value1', operator: 'operator1' },
      { name: 'name2', value: 'value2', operator: 'operator2' },
      { name: 'name3', value: 'value3', operator: 'operator3' },
      { name: 'name4', value: 'value4', operator: 'operator4' }
    ];

    it('should find tag based on name', () => {
      expect(getTagFromList(list, { name: 'a' })).to.equal(null);
      expect(getTagFromList(list, { name: 'name1' })).to.not.equal(null);
      expect(getTagFromList(list, { name: 'name2' })).to.not.equal(null);
      expect(getTagFromList(list, { name: 'name3' })).to.not.equal(null);
      expect(getTagFromList(list, { name: 'name4' })).to.not.equal(null);
    });

    it('should find tag based on value', () => {
      expect(getTagFromList(list, { value: 'a' })).to.equal(null);
      expect(getTagFromList(list, { value: 'value1' })).to.not.equal(null);
      expect(getTagFromList(list, { value: 'value2' })).to.not.equal(null);
      expect(getTagFromList(list, { value: 'value3' })).to.not.equal(null);
      expect(getTagFromList(list, { value: 'value4' })).to.not.equal(null);
    });

    it('should find tag based on operator', () => {
      expect(getTagFromList(list, { operator: 'a' })).to.equal(null);
      expect(getTagFromList(list, { operator: 'operator1' })).to.not.equal(null);
      expect(getTagFromList(list, { operator: 'operator2' })).to.not.equal(null);
      expect(getTagFromList(list, { operator: 'operator3' })).to.not.equal(null);
      expect(getTagFromList(list, { operator: 'operator4' })).to.not.equal(null);
    });

    it('should find tag based on name, value annd operator', () => {
      expect(getTagFromList(list, { name: 'name1', value: 'value1', operator: 'unknown' })).to.equal(null);
      expect(getTagFromList(list, { name: 'name1', value: 'unknown', operator: 'operator1' })).to.equal(null);
      expect(getTagFromList(list, { name: 'unknown', value: 'value1', operator: 'operator1' })).to.equal(null);
      expect(getTagFromList(list, { name: 'name1', value: 'value1', operator: 'operator1' })).to.not.equal(null);
    });
  });
});
