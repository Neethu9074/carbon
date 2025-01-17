/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import classNames from 'classnames';
import React from 'react';

import { CarbonButton, Typography } from '@instana/components';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import {
  PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED,
  PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED
} from 'in-services/tracking/tracking';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './PlayWithHeader.mless';

export function getPageType(pathname = '/') {
  const pageName = pathname.split('/')[1];

  switch (pageName) {
    case 'physical':
      return { pageName: 'Infrastructure' };
    case 'websiteMonitoring':
      return { pageName: 'EUM' };
    case 'config':
      return { pageName: 'Settings' };
    case '':
      return { pageName: '--' };
    default:
      return { pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1) };
  }
}

const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);

export default function NewPlayWithHeader() {
  const location = useLocation();
  const { trackCta } = useSegmentTracking();
  return (
    <div className={classNames(locals.newPlayWithInstana)}>
      <span className={classNames(locals.message)}>
        <Typography onDark variant="body-regular">
          {t('in-plg:playwithinstana.content')}?
        </Typography>
      </span>

      <CarbonButton
        className={classNames(locals.bannerButton)}
        id="free_trial"
        kind="primary"
        target="_blank"
        href="https://www.ibm.com/account/reg/us-en/signup?formid=urx-52345&utm_source=playwith"
        onClick={() => {
          trackCta(PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED, getPageType(location.pathname));
        }}
        renderIcon={() => <IconForButton icon="lib_arrow_up_right" iconSize="s" />}
      >
        {t('in-plg:playwithinstana.freetrial')}
      </CarbonButton>

      <CarbonButton
        className={classNames(locals.bannerButton)}
        id="schedule_demo"
        kind="ghost"
        target="_blank"
        href="https://www.ibm.com/account/reg/us-en/subscribe?formid=DEMO-automateinstana&utm_source=playwith"
        onClick={() => {
          trackCta(PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED, getPageType(location.pathname));
        }}
        renderIcon={() => <IconForButton icon="lib_demo" iconSize="s" />}
      >
        {t('in-plg:playwithinstana.bookdemo')}
      </CarbonButton>
      <Tooltip align="bottomRight" content={t('in-plg:licenseBanner.shareTooltip')}>
        <CarbonButton
          id="shareButton"
          kind="ghost"
          target="_blank"
          onClick={() => addActiveDialog(<DeferredShareAndInviteDialogBox />)}
          renderIcon={() => <IconForButton icon="lib_actions_share" iconSize="s" />}
        >
          {t('in-plg:licenseBanner.share')}
        </CarbonButton>
      </Tooltip>

      <div className={locals.verticalLine} />
      <CarbonButton
        id="take_tour"
        kind="ghost"
        target="_blank"
        renderIcon={() => <IconForButton icon="lib_crossroads" iconSize="s" />}
      >
        {t('in-plg:playwithinstana.taketour')}
      </CarbonButton>
    </div>
  );
}
