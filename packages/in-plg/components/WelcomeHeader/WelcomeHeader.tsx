/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

// import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
// import { openAssistMe } from 'in-plg/components/AssistMe/AssistMe';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
// @ts-expect-error missing a type definition for it
import UrlShortenerOverlay from 'in-components/DashboardHeader/UrlShortener/UrlShortenerOverlay';
import { track, URL_SHORTENER_OPEN } from 'in-services/tracking/tracking';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import Overlay from 'in-components/overlays/Overlay';

// import { user } from 'in-stores/user';

export default function WelcomeHeader() {
  // const headerTitle = `${t('in-plg:welcomepage.heading')}, ${user?.fullName ?? ''}!`;
  // const { createHrefToPath } = useNavigation();

  // const tileData = [
  //   {
  //     key: 'consumeData',
  //     title: t('in-plg:welcomepage.consumeData.title'),
  //     description: t('in-plg:welcomepage.consumeData.description'),
  //     buttonName: t('in-plg:welcomepage.consumeData.buttonName'),
  //     buttonType: t('in-plg:welcomepage.consumeData.buttonType')
  //   },
  //   {
  //     key: 'inviteTeammates',
  //     title: t('in-plg:welcomepage.inviteTeammates.title'),
  //     description: t('in-plg:welcomepage.inviteTeammates.description'),
  //     buttonName: t('in-plg:welcomepage.inviteTeammates.buttonName'),
  //     buttonType: t('in-plg:welcomepage.inviteTeammates.buttonType')
  //   },
  //   {
  //     key: 'nextSteps',
  //     title: t('in-plg:welcomepage.nextSteps.title'),
  //     description: t('in-plg:welcomepage.nextSteps.description'),
  //     buttonName: t('in-plg:welcomepage.nextSteps.buttonName'),
  //     buttonType: t('in-plg:welcomepage.nextSteps.buttonType')
  //   }
  // ];

  // function createRedirectHref(currentTile: string) {
  //   if (currentTile == 'consumeData') {
  //     return createHrefToPath('/agents/installation');
  //   } else {
  //     return createHrefToPath('/config/team/accessControl/users');
  //   }
  // }

  return (
    <div data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}>
      {/* <HeaderTile headerTitle={headerTitle} datepicker={<DatePickerHeader />}>
        {tileData.map(({ title, description, buttonName, buttonType, key }) => (
          <HeaderItemTile
            key={key}
            title={title}
            description={description}
            buttonName={buttonName}
            buttonType={buttonType === 'primary' ? 'primary' : 'ghost'}
            href={key === 'nextSteps' ? undefined : createRedirectHref(key)}
            onClick={e => {
              e.stopPropagation();
              if (key === 'nextSteps') {
                openAssistMe();
              }
            }}
          />
        ))}
      </HeaderTile> */}
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
