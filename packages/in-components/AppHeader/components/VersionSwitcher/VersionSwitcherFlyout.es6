import React from 'react';

import {
  isTwoZeroBetaPhase,
  twoZeroModeEnabled,
  twoZeroLearnMoreButtonEnabled,
  oneZeroSupportedUntilMessageEnabled
} from 'in-services/featureFlags';
import { v2UsageDurationTracker } from 'in-services/tracking/mixpanelTrackers';
import { applicationsList } from 'in-applications/navigation/paths';
import { evaluateClassNames } from 'in-services/util/classnames';
import { stopPropagation } from 'in-services/util/function';
import Button from 'in-new-components/Button';
import { setIn } from 'in-services/settings';

import locals from './VersionSwitcherFlyout.mless';

export default function VersionSwitcherFlyout() {
  if (!isTwoZeroBetaPhase) {
    return null;
  }

  return (
    <section className={locals.flyout}>
      <Item active={twoZeroModeEnabled}>
        <Title>
          Application Perspectives <span className={locals.beta}>New</span>
        </Title>

        <Description>Explore the new application hierarchy and trace/call analytics.</Description>
      </Item>

      {twoZeroLearnMoreButtonEnabled && (
        <Button
          href="https://www.instana.com/application-perspectives"
          target="_blank"
          className={locals.learnMore}
          onClick={stopPropagation}
          size="compact"
          kind="primary"
        >
          Learn More
        </Button>
      )}

      <Item active={!twoZeroModeEnabled}>
        <Title>Previous Version</Title>

        <Description>
          Access the traditional Instana experience during the transition period{oneZeroSupportedUntilMessageEnabled
            ? ', until August 31'
            : ''}.
        </Description>
      </Item>
    </section>
  );
}

function Item({ children, active }) {
  return (
    <a
      className={evaluateClassNames({
        [locals.item]: true,
        [locals.active]: active
      })}
      href=""
      onClick={active ? null : switchVersion}
    >
      {children}
    </a>
  );
}

function Title({ children }) {
  return <h1 className={locals.title}>{children}</h1>;
}

function Description({ children }) {
  return <p className={locals.description}>{children}</p>;
}

function switchVersion(e) {
  e.preventDefault();
  e.stopPropagation();

  v2UsageDurationTracker.stop({ v2Was: twoZeroModeEnabled });
  setIn('v2Enabled', !twoZeroModeEnabled);

  const a = document.createElement('a');
  a.href = window.location.href;

  if (!twoZeroModeEnabled) {
    a.hash = `#${applicationsList}?v2=true`;
  } else {
    a.hash = `#/?v2=false`;
  }

  // If we only change the hash, then the browser will try to update the current document's state.
  // This results in weird artifacts that we don't want to have. Instead, force a document reload
  // by setting an unused query parameter.
  a.search = `?bust=${Date.now()}`;

  window.location.href = a.href;
}
