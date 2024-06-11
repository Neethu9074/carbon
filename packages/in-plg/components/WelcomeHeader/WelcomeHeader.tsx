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
import { shareAndInviteEnabled, ampCompanyInfoEnabled, playwithEnabled } from 'in-services/featureFlags';
import HeaderTileWrapper from 'in-plg/pages/WelcomePage/HeaderTileWrapper';
import { track, URL_SHORTENER_OPEN } from 'in-services/tracking/tracking';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
import Overlay from 'in-components/overlays/Overlay';
import { user } from 'in-stores/user';

export default function WelcomeHeader() {
  // @ts-expect-error The User type needs to be updated.
  const headerTitle = `${t('in-plg:welcomepage.heading')}, ${user?.fullName ?? ''}!`;
  const foldableTileTitle = t('in-plg:welcomepage.foldableTileTitle');

  return (
    <div data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}>
      {!ampCompanyInfoEnabled || playwithEnabled ? (
        //if hubforce is not enabled or if its playwith environment, the collapsible banner is not required
        <HeaderTile
          tileData={[]}
          headerTitle={headerTitle}
          foldableTileTitle={foldableTileTitle}
          datepicker={<DatePickerHeader />}
        />
      ) : (
        //HeaderTile Wrapper is used for fetching portal data, process it and return to HeaderTile
        <HeaderTileWrapper
          headerTitle={headerTitle}
          foldableTileTitle={foldableTileTitle}
          datepicker={<DatePickerHeader />}
        />
      )}
    </div>
  );
}

export function DatePickerHeader() {
  return (
    <div className="header">
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
