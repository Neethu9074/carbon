import { storiesOf } from '@storybook/react';
import RoEmitter from 'roemitter';
import React from 'react';

import ServiceInformation from 'in-new-components/ApplicationMap/components/Tooltips/ServiceInformation/ServiceInformation';
import { ConnectionTooltipContent } from 'in-new-components/ApplicationMap/components/Tooltips/ConnectionTooltip';
import { NodeComponent } from 'in-new-components/ApplicationMap/components/Node/Node';
import ContextMenu from 'in-new-components/ApplicationMap/components/ContextMenu';
import { ApplicationMapReactComponent } from 'in-new-components/ApplicationMap';
import { deepCopy } from 'in-services/util/object';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Application/Application Map', module)
  .add('Loading', () => <LoadingMapStory />)
  .add('Erroneous', () => <ErrorMapStory />)
  .add('Application Map', () => <ApplicationMapStory />)
  .add('Node States', () => <NodeStatesStory />)
  .add('Service Tooltip', () => <ServiceTooltipStory />)
  .add('Connection Tooltip', () => <ConnectionTooltipStory />)
  .add('Service Context Menu', () => <ContextMenuStory />);

function LoadingMapStory() {
  return (
    <Root>
      <ApplicationMapReactComponent result={{ progress: { loading: true } }} customHeight={500} />
    </Root>
  );
}

function ErrorMapStory() {
  return (
    <Root>
      <ApplicationMapReactComponent result={{ errors: ['omg'] }} customHeight={500} />
    </Root>
  );
}

function ApplicationMapStory() {
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
    <Root>
      <ApplicationMapReactComponent
        result={{ data: dummyData }}
        customHeight={800}
        applicationId={dummyData.applications[0].id}
        layouter="force"
        particles={false}
        traffic={false}
      />
    </Root>
  );
}

function NodeStatesStory() {
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
    <Root>
      <Section title="Details">
        <div style={{ display: 'flex' }}>
          <NodeWrapper title="default">
            <NodeComponent node={node} nodesSize="mid" isHidden={false} />
          </NodeWrapper>
          <NodeWrapper title="less">
            <NodeComponent node={node} nodesSize="sm" isHidden={false} />
          </NodeWrapper>
        </div>
      </Section>

      <Section title="Hidden">
        <div style={{ display: 'flex' }}>
          <NodeWrapper title="default">
            <NodeComponent node={node} nodesSize="mid" isHidden={false} />
          </NodeWrapper>
          <NodeWrapper title="hidden">
            <NodeComponent node={node} nodesSize="mid" isHidden />
          </NodeWrapper>
        </div>
      </Section>

      <Section title="Health">
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
      </Section>
    </Root>
  );
}

function NodeWrapper({ title, children }) {
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

function ServiceTooltipStory() {
  return (
    <Root>
      <Section title="Loading">
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
      </Section>

      <Section title="Erroneous">
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
      </Section>

      <Section title="Default">
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
      </Section>
    </Root>
  );
}

function ConnectionTooltipStory() {
  return (
    <Root>
      <Section title="No Data">
        <ConnectionTooltipContent connection={{ id: 's1-to-s2' }} />
      </Section>

      <Section title="Default">
        <ConnectionTooltipContent
          connection={{ id: 's1-to-s2' }}
          data={{
            calls: 42,
            errorRate: 0.42,
            latency: 1234
          }}
        />
      </Section>
    </Root>
  );
}

function ContextMenuStory() {
  return (
    <Root>
      <ContextMenu
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
    </Root>
  );
}
