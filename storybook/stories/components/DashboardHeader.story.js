import { storiesOf } from '@storybook/react';
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import Section from '../_helpers/Section';

export default {
  title: 'Components/Dashboard Header',
  component: DashboardHeader
};

storiesOf('Components/Dashboard Header', module)
  .addParameters({ component: DashboardHeader })
  .add('default', () => <Default />)
  .add('loading', () => <Loading />);

function Default() {
  return <Headers />;
}

function Loading() {
  return <Headers additionalProps={{ result: {} }} />;
}

function Headers({ additionalProps }) {
  return (
    <div style={{ background: '#e0e0e0', padding: '0 3rem' }}>
      <Section title="Raw">
        <DashboardHeader
          {...additionalProps}
          icon="lib_application"
          label="Instana Demo - Discount Application 0.0.1"
        />
      </Section>
      <Section title="With meta information">
        <DashboardHeader
          {...additionalProps}
          icon="lib_website"
          label="Robot Shop"
          renderMetaInformation={renderMetaInformation}
        />
      </Section>
      <Section title="With buttons">
        <DashboardHeader
          {...additionalProps}
          icon="lib_kubernetes"
          label="k8s-demo"
          renderButtonLine={renderButtonLine}
        />
      </Section>
      <Section title="With context">
        <DashboardHeader
          {...additionalProps}
          icon="lib_application_trace"
          contextIcon="lib_analyze_inverted"
          label="42 Traces"
          renderContext={() => 'Analyze'}
        />
        <Spacer />
        <DashboardHeader
          {...additionalProps}
          icon="lib_application_trace"
          contextIcon="lib_analyze_inverted"
          label="42 Traces"
          renderContext={renderContext}
        />
      </Section>
      <Section title="Themes">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DashboardHeader
            {...additionalProps}
            theme={themes.default}
            icon="lib_website"
            label="Robot Shop"
            renderButtonLine={renderButtonLine}
          />
          <Spacer />
          <DashboardHeader
            {...additionalProps}
            theme={themes.light}
            icon="lib_website"
            label="Robot Shop"
            renderButtonLine={renderButtonLine}
          />
          <Spacer />
          <DashboardHeader
            {...additionalProps}
            theme={themes.dark}
            icon="lib_infrastructure"
            label="instana-mc-demo"
            contextIcon="lib_infrastructure_inverted"
            renderContext={() => 'Infrastructure Map'}
            renderButtonLine={renderButtonLine}
          />
        </div>
      </Section>
      <Section title="Full example">
        <DashboardHeader
          {...additionalProps}
          icon="lib_infrastructure"
          label="instana-mc-demo"
          contextIcon="lib_infrastructure_inverted"
          renderContext={() => 'Infrastructure Map'}
          renderMetaInformation={renderMetaInformation}
          renderButtonLine={renderButtonLine}
        />
      </Section>
    </div>
  );
}

function Spacer() {
  return <div style={{ height: 16, width: 16 }} />;
}

function renderButtonLine() {
  return (
    <>
      <Button kind="create" icon="lib_help_error_warning">
        No issues
      </Button>
      <Spacer />
      <Button kind="info" icon="lib_context_guide_stack">
        Stack
      </Button>
      <Spacer />
      <Button icon="lib_application_call">Analyze Calls</Button>
    </>
  );
}

function renderContext() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ color: '#637282', lineHeight: 1, fontSize: 12 }}>Applications (3)</span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ lineHeight: 1, fontSize: 14, fontWeight: 600 }}>robot-shop</span>
        <SvgIcon type="lib_arrow_drop_down" size="xs" />
      </div>
    </div>
  );
}

function renderMetaInformation() {
  return (
    <>
      <EndpointTypeBadgeList types={['MESSAGING']} />
      <TechnologyIndicatorList technologies={['springbootApplicationContainer', 'rabbitMq']} responsive={false} />
    </>
  );
}
