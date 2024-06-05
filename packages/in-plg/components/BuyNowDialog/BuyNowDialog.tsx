/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Ul, Li, KeyValue, Stack, Link, LicenseBannerButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  BUY_NOW_BUTTON_AWS_CLICKED,
  BUY_NOW_BUTTON_IBM_CLICKED,
  REQUEST_QUOTE_BUTTON_CLICKED,
  track
} from 'in-services/tracking/tracking';
import {
  generateBuyOnIbmUrl,
  getPlatformSubscriptionIdsForTenantAndUnit
} from 'in-plg/components/UsageBanner/UsageBanner';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-plg/components/BuyNowDialog/BuyNowDialog.mless';

export const BuyNowDialog = () => {
  const location = useLocation();
  const platformSubscriptionIdsForTenantAndUnit = useObservable(getPlatformSubscriptionIdsForTenantAndUnit(1), []);
  const [platformSubscriptionIdFreetrial] = platformSubscriptionIdsForTenantAndUnit?.length
    ? platformSubscriptionIdsForTenantAndUnit
    : '';
  return (
    <Dialog
      className={locals.dialog}
      title={
        <Typography noMargin variant="heading-06">
          {t('in-plg:buyNowDialog.title')}
        </Typography>
      }
      onClose={close}
      withoutBodyPadding
    >
      <div className={locals.allDialogcontent}>
        <Stack direction="vertical" gap="disabled">
          <Typography noMargin variant="heading-03">
            {t('in-plg:buyNowDialog.subHeadingPart1')}
          </Typography>
          <Typography noMargin variant="heading-03">
            {t('in-plg:buyNowDialog.subHeadingPart2')}
          </Typography>
        </Stack>
        <Stack direction="horizontal" gap="normal">
          <div className={locals.mainBodyDialog}>
            <div className={locals.mainBodyContent}>
              <Stack direction="vertical" gap="normal">
                <Stack direction="vertical" gap="gutter">
                  <Stack direction="vertical" gap="xsmall">
                    <Typography variant="body-bold">{t('in-plg:buyNowDialog.mainBodyTitle1')}</Typography>
                    <Typography variant="body-regular">{t('in-plg:buyNowDialog.mainBodyDescription1')}</Typography>
                  </Stack>
                  <Stack direction="vertical" gap="xsmall">
                    <Typography variant="body-bold">{t('in-plg:buyNowDialog.mainBodyTitle2')}</Typography>
                    <Typography variant="body-regular">{t('in-plg:buyNowDialog.mainBodyDescription2')}</Typography>
                  </Stack>
                </Stack>
                <Ul>
                  <Li>
                    <KeyValue
                      value={<Typography variant="heading-01">{t('in-plg:buyNowDialog.listTitle1')}</Typography>}
                    />
                    <KeyValue
                      value={<Typography variant="heading-01">{t('in-plg:buyNowDialog.listTitle2')}</Typography>}
                    />
                  </Li>
                  <Li>
                    <KeyValue value={<Typography variant="body-01">{t('in-plg:buyNowDialog.listUnit1')}</Typography>} />
                    <KeyValue value={<Typography variant="body-01">{t('in-plg:buyNowDialog.listCost1')}</Typography>} />
                  </Li>
                  <Li>
                    <KeyValue value={<Typography variant="body-01">{t('in-plg:buyNowDialog.listUnit2')}</Typography>} />
                    <KeyValue value={<Typography variant="body-01">{t('in-plg:buyNowDialog.listCost2')}</Typography>} />
                  </Li>
                </Ul>
              </Stack>
            </div>
          </div>
          <div className={locals.sidePanelDialog}>
            <Stack direction="vertical" gap="gutter">
              <Stack direction="vertical" gap="xsmall">
                <Typography variant="body-bold">{t('in-plg:buyNowDialog.sidePanelTitle')}</Typography>
                <Typography variant="body-regular">{t('in-plg:buyNowDialog.sidePanelDescription')}</Typography>
              </Stack>
              <Link
                linkIconType="lib_views_external_link"
                href="https://www.ibm.com/account/reg/us-en/signup?formid=QTE-automateinstana&utm_source=instanaproduct"
                target="_blank"
                //@ts-expect-error id prop not defined in Link component
                id="wm-requestaquote"
                onClick={() => {
                  track(REQUEST_QUOTE_BUTTON_CLICKED, getPageType(location.pathname));
                }}
              >
                {t('in-plg:licenseBanner.requestQuoteBtn')}
              </Link>
            </Stack>
          </div>
        </Stack>
      </div>
      <Stack direction="horizontal" gap="disabled">
        <LicenseBannerButton noAutoMargin className={locals.dialogButton} kind="ghost" size="lg" onClick={close}>
          {t('in-plg:buyNowDialog.cancelbtn')}
        </LicenseBannerButton>
        <LicenseBannerButton
          noAutoMargin
          id="wm-buyonaws"
          className={locals.dialogButton}
          kind="tertiary"
          icon="lib_views_external_link"
          size="lg"
          target="_blank"
          href="https://aws.amazon.com/marketplace/pp/prodview-tbam5h35sumqg?sr=0-1&ref_=beagle&applicationId=AWSMPContessa"
          //@ts-ignore rel is not defined in types
          rel="noopener noreferrer"
          onClick={() => track(BUY_NOW_BUTTON_AWS_CLICKED, getPageType(location.pathname))}
        >
          {t('in-plg:licenseBanner.buyNowBtn')}
        </LicenseBannerButton>
        <LicenseBannerButton
          id="wm-buyonibm"
          className={locals.dialogButton}
          kind="primary"
          icon="lib_views_external_link"
          size="lg"
          target="_blank"
          href={generateBuyOnIbmUrl(platformSubscriptionIdFreetrial)}
          //@ts-ignore rel is not defined in types
          rel="noopener noreferrer"
          onClick={() => track(BUY_NOW_BUTTON_IBM_CLICKED, getPageType(location.pathname))}
        >
          {t('in-plg:licenseBanner.buyNowBtnIbm')}
        </LicenseBannerButton>
      </Stack>
    </Dialog>
  );
};

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
