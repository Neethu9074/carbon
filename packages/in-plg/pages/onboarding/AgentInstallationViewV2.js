/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import OnboardingWidget from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidget';
import AgentCatalogV2 from 'in-plg/pages/onboarding/AgentCatalogV2';
import AgentCatalog from 'in-plg/pages/onboarding/AgentCatalog';
import { newOTelPageEnabled } from 'in-services/featureFlags';

import locals from './AgentInstallationViewV2.mless';

export default function AgentInstallationViewV2() {
  return <OnboardingWidget Renderer={Renderer} trackingIdPrefix="agent.installation" />;
}

function Renderer() {
  return <div className={locals.wrapper}>{newOTelPageEnabled ? <AgentCatalogV2 /> : <AgentCatalog />}</div>;
}
