/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useHistory } from 'react-router';
import React, { useEffect } from 'react';

import { Link, SvgIcon, Stack, CarbonButton } from '@instana/components';
import { Observable, create, just } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

//@ts-expect-error missing typescript migration
import { getQueuedLicensesOfEnvironmentAsResultObservable } from 'in-amp/api/account';
import { SHARE_AND_INVITE_INVITEE_JOINED } from 'in-services/tracking/eventNames';
import { countryCode, editionID, languageCode } from 'in-plg/utils/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { BuyNowDialog } from 'in-plg/components/BuyNowDialog/BuyNowDialog';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Message } from 'in-components/MessageFlyout/stores/messages';
import memoize from 'in-services/util/memoizingObservableGenerator';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import http from 'in-services/http/http';
import { user } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './UsageBanner.mless';

interface UsageBannerProps {
  message: Message;
}

export function UsageBanner({ message }: UsageBannerProps) {
  const [role] = useCurrentUserRole();
  const location = useLocation();
  const history = useHistory();
  const { createHref } = useNavigation();
  const { trackCta } = useSegmentTracking();
  const queuedLicenseDetails =
    useObservable(() => {
      if (!role?.canViewAccountAndBillingInformation) return just(undefined);

      return getQueuedLicensesOfEnvironmentAsResultObservable(1, 5) as Observable<Result<any>>;
    }, [generateStableHash(role)]) ?? pendingResult;
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
  const needToShowReminder =
    role?.canViewAccountAndBillingInformation &&
    queuedLicenseDetails &&
    isRemainingDaysLimited &&
    isPaidLicenseUsage &&
    noQueuedLicense;

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
      {onPremLicenseInformationEnabled ? (
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
      ) : (
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
