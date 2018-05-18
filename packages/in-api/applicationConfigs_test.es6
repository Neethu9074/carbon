/* eslint-env mocha, node */
import { expect } from 'chai';

import { mapFromServerResponse, mapToServerResponse } from 'in-api/applicationConfigs';

describe('in-api/applicationConfigs', () => {
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
  });
});
