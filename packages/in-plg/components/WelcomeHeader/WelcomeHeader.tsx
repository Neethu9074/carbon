/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton, HeaderItemTile, HeaderTile, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error missing a type definition for it
import UrlShortenerOverlay from 'in-components/DashboardHeader/UrlShortener/UrlShortenerOverlay';
import { track, URL_SHORTENER_OPEN } from 'in-services/tracking/tracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Overlay from 'in-components/overlays/Overlay';
import { openAssistMe } from '../AssistMe/AssistMe';
import DatePicker from '../DatePicker/DatePicker';
import { user } from 'in-stores/user';

export default function WelcomeHeader() {
  // @ts-expect-error The User type needs to be updated.
  const headerTitle = `${t('in-plg:welcomepage.heading')} ${user?.fullName ?? ''}`;
  const { createHrefToPath } = useNavigation();

  const tileData = [
    {
      key: 'consumeData',
      title: t('in-plg:welcomepage.consumeData.title'),
      description: t('in-plg:welcomepage.consumeData.description'),
      buttonName: t('in-plg:welcomepage.consumeData.buttonName'),
      buttonType: t('in-plg:welcomepage.consumeData.buttonType')
    },
    {
      key: 'inviteTeammates',
      title: t('in-plg:welcomepage.inviteTeammates.title'),
      description: t('in-plg:welcomepage.inviteTeammates.description'),
      buttonName: t('in-plg:welcomepage.inviteTeammates.buttonName'),
      buttonType: t('in-plg:welcomepage.inviteTeammates.buttonType')
    },
    {
      key: 'nextSteps',
      title: t('in-plg:welcomepage.nextSteps.title'),
      description: t('in-plg:welcomepage.nextSteps.description'),
      buttonName: t('in-plg:welcomepage.nextSteps.buttonName'),
      buttonType: t('in-plg:welcomepage.nextSteps.buttonType')
    }
  ];

  const datepicker = (
    <div className="header">
      <Stack direction="horizontal">
        <UrlShortener darkTheme={false} />
        <DatePicker darkTheme={false} />
      </Stack>
    </div>
  );

  function UrlShortener(props: any) {
    return (
      <Overlay props={props} content={UrlShortenerOverlay} withoutWrapper withoutArrow>
        {({ toggle, refSetter }) => (
          <DashboardButton
            id="url-shortener-button"
            ariaLabel={t('in-plg:welcomepage.ariaLabel.shareButton')}
            icon="lib_actions_interface_link"
            kind="tertiary"
            onClick={() => {
              track(URL_SHORTENER_OPEN);
              toggle();
            }}
            ref={refSetter}
          />
        )}
      </Overlay>
    );
  }

  function createRedirectHref(currentTile: string) {
    if (currentTile == 'consumeData') {
      return createHrefToPath('/agents/installation');
    } else {
      return createHrefToPath('/config/team/accessControl/users');
    }
  }

  return (
    <HeaderTile headerTitle={headerTitle} datepicker={datepicker}>
      {tileData.map(tile => (
        <HeaderItemTile
          title={tile.title}
          description={tile.description}
          buttonName={tile.buttonName}
          buttonType={tile.buttonType == 'primary' ? 'primary' : 'ghost'}
          href={tile.key == 'nextSteps' ? undefined : createRedirectHref(tile.key)}
          onClick={tile.key == 'nextSteps' ? () => openAssistMe() : undefined}
        />
      ))}
    </HeaderTile>
  );
}
