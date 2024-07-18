/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton, HeaderTile, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error missing a type definition for it
import UrlShortenerOverlay from 'in-components/DashboardHeader/UrlShortener/UrlShortenerOverlay';
import OnboardingStepBuilder from 'in-plg/pages/WelcomePage/OnboardingStepBuilder';
import { track, URL_SHORTENER_OPEN } from 'in-services/tracking/tracking';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
import Overlay from 'in-components/overlays/Overlay';
import { user } from 'in-stores/user';

interface WelcomeHeaderProps {
  onboardingHeaderEnabled: boolean;
}

export default function WelcomeHeader({ onboardingHeaderEnabled }: WelcomeHeaderProps) {
  const headerTitle = `${t('in-plg:welcomepage.heading')}, ${user?.fullName ?? ''}!`;
  const foldableTileTitle = t('in-plg:welcomepage.foldableTileTitle');
  const collapsibleButton = {
    showOnboardingTasks: t('in-plg:welcomepage.collapsibleButton.showOnboardingTasks'),
    hideOnboardingTasks: t('in-plg:welcomepage.collapsibleButton.hideOnboardingTasks')
  };

  return (
    <div data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')} data-testid="header">
      <HeaderTile
        tileData={onboardingHeaderEnabled ? OnboardingStepBuilder() : []}
        headerTitle={headerTitle}
        foldableTileTitle={foldableTileTitle}
        datepicker={<DatePickerHeader />}
        collapsibleButton={collapsibleButton}
      />
    </div>
  );
}

export function DatePickerHeader() {
  return (
    <div className="header" data-testid="date-picker">
      <Stack direction="horizontal">
        {!shareAndInviteEnabled && <UrlShortener darkTheme={false} />}
        <DatePicker darkTheme={false} />
      </Stack>
    </div>
  );
}

export function UrlShortener(props: any) {
  return (
    <Overlay props={props} content={UrlShortenerOverlay} withoutWrapper withoutArrow>
      {({ toggle, refSetter }) => (
        <DashboardButton
          id="url-shortener-button"
          ariaLabel={t('in-plg:welcomepage.ariaLabel.shareButton')}
          icon="lib_actions_interface_link"
          iconDescription={t('in-plg:welcomepage.UrlShortener')}
          kind="tertiary"
          onClick={e => {
            track(URL_SHORTENER_OPEN);
            toggle();
            e.stopPropagation();
          }}
          ref={refSetter}
        />
      )}
    </Overlay>
  );
}
