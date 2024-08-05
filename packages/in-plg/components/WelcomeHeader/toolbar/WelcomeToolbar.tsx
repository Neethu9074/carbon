/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton, Stack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error missing a type definition for it
import UrlShortenerOverlay from 'in-components/DashboardHeader/UrlShortener/UrlShortenerOverlay';
import { track, URL_SHORTENER_OPEN } from 'in-services/tracking/tracking';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
import Overlay from 'in-components/overlays/Overlay';

import locals from 'in-plg/components/WelcomeHeader/toolbar/WelcomeToolbar.mless';

function DatePickerHeader({ shareAndInviteEnabled }: { shareAndInviteEnabled: boolean }) {
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

interface WelcomeToolbarProps {
  title: string;
  shareAndInviteEnabled: boolean;
}

export default function WelcomeToolbar({ title, shareAndInviteEnabled }: WelcomeToolbarProps) {
  return (
    <div className={locals.toolbar}>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <Stack align="start">
          <Typography variant="heading-03">{title}</Typography>
        </Stack>
        <Stack>
          <DatePickerHeader shareAndInviteEnabled={shareAndInviteEnabled} />
        </Stack>
      </Stack>
    </div>
  );
}
