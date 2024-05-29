/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/TeamSettings/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import React, { useEffect } from 'react';

import { Link, LicenseBannerButton, SvgIcon, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
//@ts-expect-error missing typescript migration
import { getQueuedLicensesAsResultObservable } from 'in-amp/api/account';
//@ts-expect-error missing typescript migration
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import { BUY_NOW_BUTTON_CLICKED, REQUEST_QUOTE_BUTTON_CLICKED, track } from 'in-services/tracking/tracking';
import { onPremLicenseInformationEnabled, shareAndInviteEnabled } from 'in-services/featureFlags';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Message } from 'in-components/MessageFlyout/stores/messages';
import AssistMe from 'in-plg/components/AssistMe/AssistMe';
import { invitedUserJoined } from 'in-settings/tracker';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip';
import { user } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './UsageBanner.mless';

interface UsageBannerProps {
  message: Message;
}

export function UsageBanner({ message }: UsageBannerProps) {
  const location = useLocation();
  //@ts-expect-error
  const queuedLicenseDetails: Result<any> = useObservable(getQueuedLicensesAsResultObservable(1), []);
  const { activeLicense, remainingDays, content } = message;
  const isQuota = activeLicense === 'quota';
  const isSelfService = activeLicense === 'selfService';
  const isFreeNotForResale = activeLicense === 'free_not_for_resale';
  const isPaidLicenseUsage = activeLicense === 'hostBasedPaid';
  const isRemainingDaysLimited = remainingDays! <= 30;
  const isTrial = isSelfService || isQuota;
  const queuedUpLicense = queuedLicenseDetails?.data?.items[0]?.license.type;
  const noQueuedLicense =
    !isLoading(queuedLicenseDetails) && queuedUpLicense !== 'paidPerUse' && queuedUpLicense !== 'hostBasedPaid';
  const needToShowReminder = isRemainingDaysLimited && isPaidLicenseUsage && noQueuedLicense;

  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);

  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(location.query, 'invitedby')) {
      invitedUserJoined({
        invitedby: location.query.invitedby,
        // @ts-expect-error The User type needs to be updated.
        invitee: user?.fullName
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack align="center" direction="horizontal" gap="small">
      {(isTrial || (isFreeNotForResale && isRemainingDaysLimited) || needToShowReminder) && (
        <>
          <span className={locals.description}>{content}</span>
          <IconForRemainingDays remainingDays={remainingDays} />
        </>
      )}

      {onPremLicenseInformationEnabled && (
        <div className={locals.subText}>
          <Trans
            i18nKey="in-plg:licenseBanner.alreadyHaveLicense"
            components={{
              linkToDocker: (
                //@ts-expect-error missing translation
                <Link
                  className={locals.bannerLink}
                  external
                  href="https://www.ibm.com/docs/obi/current?topic=installer-license-activation-renewal"
                />
              ),
              linkToKubernetes: (
                //@ts-expect-error missing translation
                <Link
                  className={locals.bannerLink}
                  external
                  href="https://www.ibm.com/docs/obi/current?topic=kubernetes-installing-operator-based-instana-setup#312-downloading-the-license-file"
                />
              )
            }}
          />
        </div>
      )}
      {!onPremLicenseInformationEnabled && (
        <>
          {isSelfService && (
            <LicenseBannerButton
              id="wm-buyonaws"
              kind="primary"
              target="_blank"
              href="https://aws.amazon.com/marketplace/search/results?prevFilters=%257B%2522sr%2522%3A%25220-1%2522%2C%2522ref_%2522%3A%2522beagle%2522%2C%2522applicationId%2522%3A%2522AWSMPContessa%2522%257D&searchTerms=ibm+instana+observability"
              //@ts-expect-error
              rel="noopener noreferrer"
              onClick={() => track(BUY_NOW_BUTTON_CLICKED, getPageType(location.pathname))}
            >
              {t('in-plg:licenseBanner.buyNowBtn')}
            </LicenseBannerButton>
          )}
          {(isTrial || needToShowReminder) && (
            <>
              <LicenseBannerButton
                icon="lib_actions_request_quote"
                iconColor="var(--cds-link-primary)"
                id="wm-requestaquote"
                kind="ghost"
                target="_blank"
                onClick={e => {
                  stopPropagationAndPreventDefault(e);
                  track(REQUEST_QUOTE_BUTTON_CLICKED, getPageType(location.pathname));
                  addActiveDialog(<RequestQuoteDialog />);
                }}
              >
                {t('in-plg:licenseBanner.requestQuoteBtn')}
              </LicenseBannerButton>
              <div className={locals.verticalLine} />
            </>
          )}
          {shareAndInviteEnabled && (
            <>
              <Tooltip align="bottomMiddle" content={t('in-plg:licenseBanner.shareTooltip')}>
                <LicenseBannerButton
                  id="shareButton"
                  kind="ghost"
                  icon="lib_actions_share"
                  iconColor="var(--cds-link-primary)"
                  target="_blank"
                  onClick={() => addActiveDialog(<DeferredShareAndInviteDialogBox />)}
                >
                  {t('in-plg:licenseBanner.share')}
                </LicenseBannerButton>
              </Tooltip>
              <div className={locals.verticalLine} />
            </>
          )}
          <AssistMe />
        </>
      )}
    </Stack>
  );
}

function getPageType(pathname = '/') {
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

const IconForRemainingDays = ({ remainingDays = -1 }: { remainingDays: number | undefined }) => {
  /**
   * Days remaining for the free trial to end are converted into hours.
   */
  if (remainingDays >= 6) {
    return <SvgIcon type="lib_uncheck" color="var(--ids-color-option-green-500)" />;
  } else if (remainingDays >= 4 && remainingDays <= 5) {
    return <SvgIcon type="lib_help_error_warning" color="var(--ids-color-option-yellow-500)" />;
  } else if (remainingDays >= 0 && remainingDays <= 3) {
    return <SvgIcon type="lib_help_error_info_circle" color="var(--ids-color-option-red-500)" />;
  } else {
    return null;
  }
};
