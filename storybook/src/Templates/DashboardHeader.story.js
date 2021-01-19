/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

export default {
  title: 'Templates|Dashboard Header',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: DashboardHeader
};

export function Raw() {
  return <DashboardHeader icon="lib_application" label="Instana Demo - Discount Application 0.0.1" />;
}

export function WithMetaInformation() {
  return <DashboardHeader icon="lib_website" label="Robot Shop" renderMetaInformation={renderMetaInformation} />;
}

export function WithButtons() {
  return <DashboardHeader icon="lib_kubernetes" label="k8s-demo" renderButtonLine={renderButtonLine} />;
}

export function WithContext() {
  return (
    <>
      <DashboardHeader
        icon="lib_application_trace"
        label="42 Traces"
        contextConfigurations={[{ renderContext: () => 'Analyze', contextIcon: 'lib_analyze_inverted' }]}
      />{' '}
      <DashboardHeader
        icon="lib_application_trace"
        label="42 Traces"
        contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
      />
    </>
  );
}

export function Themes() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <DashboardHeader
        theme={themes.default}
        icon="lib_website"
        label="Robot Shop"
        renderButtonLine={renderButtonLine}
      />
      <Spacer />
      <DashboardHeader theme={themes.light} icon="lib_website" label="Robot Shop" renderButtonLine={renderButtonLine} />
      <Spacer />
      <DashboardHeader
        theme={themes.dark}
        icon="lib_infrastructure"
        label="instana-mc-demo"
        contextConfigurations={[
          {
            renderContext: () => 'Infrastructure Map',
            contextIcon: 'lib_lib_infrastructure_invertedanalyze_inverted'
          }
        ]}
        renderButtonLine={renderButtonLine}
      />
    </div>
  );
}

export function FullExample() {
  return (
    <DashboardHeader
      icon="lib_infrastructure"
      label="instana-mc-demo"
      contextConfigurations={[
        {
          renderContext: () => 'Infrastructure Map',
          contextIcon: 'lib_lib_infrastructure_invertedanalyze_inverted'
        }
      ]}
      renderMetaInformation={renderMetaInformation}
      renderButtonLine={renderButtonLine}
    />
  );
}

export function RawLoading() {
  const additionalProps = { result: {} };
  return (
    <DashboardHeader {...additionalProps} icon="lib_application" label="Instana Demo - Discount Application 0.0.1" />
  );
}

export function WithMetaInformationLoading() {
  const additionalProps = { result: {} };
  return (
    <DashboardHeader
      {...additionalProps}
      icon="lib_website"
      label="Robot Shop"
      renderMetaInformation={renderMetaInformation}
    />
  );
}

export function WithButtonsLoading() {
  const additionalProps = { result: {} };
  return (
    <DashboardHeader {...additionalProps} icon="lib_kubernetes" label="k8s-demo" renderButtonLine={renderButtonLine} />
  );
}

export function WithContextLoading() {
  const additionalProps = { result: {} };
  return (
    <>
      <DashboardHeader
        {...additionalProps}
        icon="lib_application_trace"
        label="42 Traces"
        contextConfigurations={[{ renderContext: () => 'Analyze', contextIcon: 'lib_analyze_inverted' }]}
      />{' '}
      <DashboardHeader
        {...additionalProps}
        icon="lib_application_trace"
        label="42 Traces"
        contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
      />
    </>
  );
}

export function ThemesLoading() {
  const additionalProps = { result: {} };
  return (
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
        contextConfigurations={[
          {
            renderContext: () => 'Infrastructure Map',
            contextIcon: 'lib_lib_infrastructure_invertedanalyze_inverted'
          }
        ]}
        renderButtonLine={renderButtonLine}
      />
    </div>
  );
}

export function FullExampleLoading() {
  const additionalProps = { result: {} };
  return (
    <DashboardHeader
      {...additionalProps}
      icon="lib_infrastructure"
      label="instana-mc-demo"
      contextConfigurations={[
        {
          renderContext: () => 'Infrastructure Map',
          contextIcon: 'lib_lib_infrastructure_invertedanalyze_inverted'
        }
      ]}
      renderMetaInformation={renderMetaInformation}
      renderButtonLine={renderButtonLine}
    />
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
