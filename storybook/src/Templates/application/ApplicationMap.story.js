/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import RoEmitter from '@instana/roemitter';
import React from 'react';

import ServiceInformation from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/ServiceInformation';
import { ConnectionTooltipContent } from 'in-applications/ApplicationMap/components/Tooltips/ConnectionTooltip';
import { ContextMenuContent } from 'in-applications/ApplicationMap/components/ContextMenu';
import { NodeComponent } from 'in-applications/ApplicationMap/components/Node/Node';
import { ApplicationMapReactComponent } from 'in-applications/ApplicationMap';
import { deepCopy } from 'in-services/util/object';

export default {
  title: 'Templates|application/ApplicationMap',
  component: ApplicationMapReactComponent
};

export function LoadingMapStory() {
  return <ApplicationMapReactComponent result={{ progress: { loading: true } }} customHeight={500} />;
}

export function ErrorMapStory() {
  return <ApplicationMapReactComponent result={{ errors: ['omg'] }} customHeight={500} />;
}

export function ApplicationMapStory() {
  function createDummyData(applicationId) {
    const numNodes = 50;
    const nodes = [];
    const edges = [];

    const applications = [];
    if (applicationId) {
      applications.push({ id: applicationId, label: applicationId });
      applications.push({ id: 'a', label: 'application a' });
    } else {
      applications.push({ id: 'a', label: 'application a' });
      applications.push({ id: 'b', label: 'application b' });
      applications.push({ id: 'c', label: 'application c' });
    }

    for (let i = 0; i < numNodes; i++) {
      const maxSeverity = Math.random() < 0.1 ? (Math.random() * 15) | 0 : 0;
      nodes.push({
        id: `s${i}`,
        label: `service ${i}`,
        types: ['HTTP', 'MESSAGING'].slice((Math.random() * 2) | 0),
        technologies: ['nodeJsRuntimePlatform', 'activeMQ'].slice((Math.random() * 2) | 0),
        maxSeverity,
        numberOpenIssues: maxSeverity > 0 ? 2 : 0,
        applications: [applications[(Math.random() * (applications.length - 0.7)) | 0].id]
      });
    }

    for (let i = 0; i < numNodes - 2; i++) {
      edges.push({
        from: `s${i}`,
        to: `s${i + 1}`,
        calls: (Math.random() * Math.random() * 10000) | 1,
        latency: (Math.random() * 3000) | 1,
        errorRate: Math.random() * Math.random()
      });
      edges.push({
        from: `s${i}`,
        to: `s${i + 2}`,
        calls: (Math.random() * Math.random() * 5000) | 1,
        latency: (Math.random() * 3000) | 1,
        errorRate: Math.random() * Math.random()
      });
    }

    return {
      services: nodes,
      connections: edges.filter(edge => edge.from !== edge.to),
      applications
    };
  }
  const dummyData = createDummyData();

  return (
    <ApplicationMapReactComponent
      result={{ data: dummyData }}
      customHeight={800}
      applicationId={dummyData.applications[0].id}
      layouter="force"
      particles={false}
      traffic={false}
    />
  );
}

export function NodeStatesStory() {
  const node = {
    id: '42',
    dimensionInPx: 50,
    events$: new RoEmitter(),
    data: {
      label: 'foobar 42',
      types: ['HTTP'],
      technologies: ['nodeJsRuntimePlatform'],
      maxSeverity: 0,
      numberOpenIssues: 0,
      applications: ['a']
    }
  };

  const unhealthyWarningNode = deepCopy(node);
  unhealthyWarningNode.data.maxSeverity = 5;
  const unhealthyDangerNode = deepCopy(node);
  unhealthyDangerNode.data.maxSeverity = 10;

  return (
    <>
      <h2>Details</h2>
      <div style={{ display: 'flex' }}>
        <NodeWrapper title="default">
          <NodeComponent node={node} nodesSize="mid" isHidden={false} />
        </NodeWrapper>
        <NodeWrapper title="less">
          <NodeComponent node={node} nodesSize="sm" isHidden={false} />
        </NodeWrapper>
      </div>

      <h2>Hidden</h2>
      <div style={{ display: 'flex' }}>
        <NodeWrapper title="default">
          <NodeComponent node={node} nodesSize="mid" isHidden={false} />
        </NodeWrapper>
        <NodeWrapper title="hidden">
          <NodeComponent node={node} nodesSize="mid" isHidden />
        </NodeWrapper>
      </div>

      <h2>Health</h2>
      <div style={{ display: 'flex' }}>
        <NodeWrapper title="healthy">
          <NodeComponent node={node} nodesSize="mid" isHidden={false} />
        </NodeWrapper>
        <NodeWrapper title="warning">
          <NodeComponent node={unhealthyWarningNode} nodesSize="mid" isHidden={false} />
        </NodeWrapper>
        <NodeWrapper title="critical">
          <NodeComponent node={unhealthyDangerNode} nodesSize="mid" isHidden={false} />
        </NodeWrapper>
      </div>
    </>
  );
}

export function NodeWrapper({ title, children }) {
  return (
    <div
      style={{
        background: '#FAFBFC',
        margin: '0px 0.5rem',
        padding: '1rem 2.5rem 1px',
        width: 130
      }}
    >
      <h3
        style={{
          margin: '-1rem  0 1rem -2.5rem',
          color: '#6A7C8F'
        }}
      >
        {title}
      </h3>
      <div style={{ position: 'relative', margin: '2.5rem 0px 2rem 1.5rem', height: 50, width: 50 }}>{children}</div>
    </div>
  );
}

export function ServiceTooltipStory() {
  return (
    <>
      <h2>Loading</h2>
      <div style={{ position: 'relative' }}>
        <ServiceInformation
          service={{
            label: 'cityservice',
            types: ['DATABASE'],
            technologies: ['postgreSqlDatabase', 'elasticsearchCluster'],
            maxSeverity: 5,
            numberOpenIssues: 3
          }}
          timeConfig={{ windowSize: 60000, to: null }}
          metricsResult={{
            data: null,
            errors: [],
            progress: { percentage: null, loading: true, note: null }
          }}
        />
      </div>

      <h2>Erroneous</h2>
      <div style={{ position: 'relative' }}>
        <ServiceInformation
          service={{
            label: 'cityservice',
            types: ['DATABASE'],
            technologies: ['postgreSqlDatabase', 'elasticsearchCluster'],
            maxSeverity: 5,
            numberOpenIssues: 3
          }}
          timeConfig={{ windowSize: 60000, to: null }}
          metricsResult={{
            data: null,
            errors: [
              { message: 'Service with ID 42 not found' },
              { message: 'Furthermore there is a very long error message to test if the components reacts properly' }
            ],
            progress: { percentage: null, loading: false, note: null }
          }}
        />
      </div>

      <h2>Default</h2>
      <div style={{ position: 'relative' }}>
        <ServiceInformation
          service={{
            label: 'cityservice',
            types: ['DATABASE'],
            technologies: ['postgreSqlDatabase', 'elasticsearchCluster'],
            maxSeverity: 5,
            numberOpenIssues: 3
          }}
          timeConfig={{ windowSize: 60000, to: null }}
          metricsResult={{
            data: {
              label: 'cityservice',
              types: ['DATABASE'],
              technologies: ['postgreSqlDatabase', 'elasticsearchCluster']
            },
            errors: [],
            progress: { percentage: null, loading: false, note: null }
          }}
        />
      </div>
    </>
  );
}

export function ConnectionTooltipStory() {
  return (
    <>
      <h2>No Data</h2>
      <ConnectionTooltipContent connection={{ id: 's1-to-s2' }} />

      <h2>Default</h2>
      <ConnectionTooltipContent
        connection={{
          id: 's1-to-s2',
          from: { node: { data: { label: 'Shop' } } },
          to: { node: { data: { label: 'Products' } } }
        }}
        data={{
          calls: 42,
          errorRate: 0.42,
          latency: 1234
        }}
      />
    </>
  );
}

export function ContextMenuStory() {
  return (
    <>
      <ContextMenuContent
        node={{
          id: 42,
          data: {
            label: 'service 42',
            types: ['HTTP'],
            technologies: ['nodeJsRuntimePlatform'],
            maxSeverity: 5,
            numberOfOpenIssues: 1,
            applications: ['a']
          }
        }}
      />
    </>
  );
}
