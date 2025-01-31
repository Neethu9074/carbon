/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { useHistory } from 'react-router';
import React, { useEffect } from 'react';

import { Link, SvgIcon, Stack } from '@instana/components';
import { Observable, create } from '@instana/observables';
import { CarbonButton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
//@ts-expect-error missing typescript migration
import { getQueuedLicensesOfEnvironmentAsResultObservable } from 'in-amp/api/account';
import {
  isWalkmeScriptLoaded,
  termsAndPrivacySettingsStore$
} from 'in-settings/terms/stores/termsAndPrivacySettingsStore';
import { onPremLicenseInformationEnabled, playWithReleaseEnabled, playwithEnabled } from 'in-services/featureFlags';
import { SHARE_AND_INVITE_INVITEE_JOINED } from 'in-services/tracking/eventNames';
import { countryCode, editionID, languageCode } from 'in-plg/utils/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { BuyNowDialog } from 'in-plg/components/BuyNowDialog/BuyNowDialog';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Message } from 'in-components/MessageFlyout/stores/messages';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { IconForButton } from '../IconForButton/IconForButton';
import { assistmeEnabled } from 'in-services/featureFlags';
import AssistMe from 'in-plg/components/AssistMe/AssistMe';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip';
import { role, user } from 'in-stores/user';
import http from 'in-services/http/http';
import { Trans, t } from 'in-i18n';

import locals from './UsageBanner.mless';

interface UsageBannerProps {
  message: Message;
}

export function UsageBanner({ message }: UsageBannerProps) {
  const location = useLocation();
  const history = useHistory();
  const { createHref } = useNavigation();
  const { trackCta } = useSegmentTracking();
  //@ts-expect-error
  const queuedLicenseDetails: Result<any> = useObservable(getQueuedLicensesOfEnvironmentAsResultObservable(1, 5), []);
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
  const termsAndPrivacySettingsStore = useObservable(termsAndPrivacySettingsStore$, []);

  const isAnyIDPActive = useIsAnyIdPActive();
  const permissionToShowInvite =
    role?.canConfigureUsers && !(playwithEnabled || playWithReleaseEnabled) && !isAnyIDPActive;
  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);
  // The AssistMe feature will be enabled if both assistmeEnabled and walkmeAnalyticsServices are enabled, and the WalkMe script is loaded.
  const isWalkMeEnabled =
    assistmeEnabled && isWalkmeScriptLoaded && termsAndPrivacySettingsStore?.walkmeAnalyticsServices;

  useEffect(() => {
    const invitedByKey = 'invitedBy';
    if (Object.prototype.hasOwnProperty.call(location.query, invitedByKey)) {
      trackCta(SHARE_AND_INVITE_INVITEE_JOINED, {
        invitedby: location.query.invitedby,
        // @ts-expect-error The User type needs to be updated.
        invitee: decodeURIComponent(user?.fullName).replace(/\+/g, ' ')
      });
      let locationString = createHref(location);
      if (locationString.includes(`&${invitedByKey}=`)) locationString = locationString.split(`&${invitedByKey}=`)[0];
      if (locationString.includes(`?${invitedByKey}=`)) locationString = locationString.split(`?${invitedByKey}=`)[0];
      locationString = locationString.replace('/#/', '/');
      history.push(locationString);
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
        <>
          <Tooltip align="bottomRight" content={t('in-plg:licenseBanner.shareTooltip')}>
            <CarbonButton
              id="shareButton"
              kind="ghost"
              target="_blank"
              onClick={() =>
                addActiveDialog(<DeferredShareAndInviteDialogBox permissionToShowInvite={permissionToShowInvite} />)
              }
              renderIcon={() => <IconForButton icon="lib_actions_share" iconSize="s" />}
            >
              {t('in-plg:licenseBanner.share')}
            </CarbonButton>
          </Tooltip>
          <div className={locals.verticalLine} />
          <div className={locals.subText}>
            <Trans
              i18nKey="in-plg:licenseBanner.alreadyHaveLicense"
              components={{
                linkToDocker: (
                  //@ts-expect-error missing translation
                  <Link className={locals.bannerLink} external href="https://ibm.biz/license-ops" />
                ),
                linkToKubernetes: (
                  //@ts-expect-error missing translation
                  <Link className={locals.bannerLink} external href="https://ibm.biz/license-sales-key-renewal" />
                )
              }}
            />
          </div>
        </>
      )}
      {!onPremLicenseInformationEnabled && (
        <>
          {(isTrial || needToShowReminder) && (
            <CarbonButton
              kind="primary"
              href={
                isSelfService
                  ? undefined
                  : 'https://www.ibm.com/account/reg/us-en/signup?formid=QTE-automateinstana&utm_source=instanaproduct'
              }
              target={isSelfService ? undefined : '_blank'}
              onClick={() => {
                if (isSelfService) {
                  addActiveDialog(<BuyNowDialog />);
                }
              }}
              className={locals.buyNow}
            >
              {t('in-plg:licenseBanner.buyNow')}
            </CarbonButton>
          )}
          <Tooltip align="bottomRight" content={t('in-plg:licenseBanner.shareTooltip')}>
            <CarbonButton
              id="shareButton"
              kind="ghost"
              target="_blank"
              onClick={() =>
                addActiveDialog(<DeferredShareAndInviteDialogBox permissionToShowInvite={permissionToShowInvite} />)
              }
              renderIcon={() => <IconForButton icon="lib_actions_share" iconSize="s" />}
            >
              {t('in-plg:licenseBanner.share')}
            </CarbonButton>
          </Tooltip>
          <div className={locals.verticalLine} />

          {isWalkMeEnabled && <AssistMe />}
        </>
      )}
    </Stack>
  );
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
const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

export function generateBuyOnIbmUrl(platformSubscriptionIds: string): string {
  const parentPageName = encodeURIComponent(getViewTrackingMetaData().pageRootName?.toString() || '');
  const parentProductArea = encodeURIComponent(getViewTrackingMetaData().productArea?.toString() || '');
  const trialId = encodeURIComponent(platformSubscriptionIds);
  const userRole =
    window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
  const encodedUserRole = encodeURIComponent(userRole);
  const generatedUrl = `https://www.ibm.com/marketplace/purchase/configuration/${languageCode}/${countryCode}/checkout?editionID=${editionID}&trialId=${trialId}&parentPageName=${parentPageName}&parentPageCategory=${parentProductArea}&userRole=${encodedUserRole}`;
  return generatedUrl;
}
export const getPlatformSubscriptionIdsForTenantAndUnit = memoize(
  getPlatformSubscriptionIdsForTenantAndUnitInternal,
  () => '',
  60000
);
function getPlatformSubscriptionIdsForTenantAndUnitInternal(): Observable<string[]> {
  return http<string[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/platformSubscriptionIds`
  }).map(response => response.body);
}
