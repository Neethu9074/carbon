/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Ul, Li, Stack, Link, LicenseBannerButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  generateBuyOnIbmUrl,
  getPlatformSubscriptionIdsForTenantAndUnit
} from 'in-plg/components/UsageBanner/UsageBanner';
import { triggerSegmentEvent } from 'in-plg/api/segmentData';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-plg/components/BuyNowDialog/BuyNowDialog.mless';

export const BuyNowDialog = () => {
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
        <Typography noMargin variant="heading-03">
          {t('in-plg:buyNowDialog.subHeading')}
        </Typography>
        <Stack direction="horizontal" gap="normal">
          <div className={locals.mainBodyDialog}>
            <div className={locals.mainBodyContent}>
              <Stack direction="vertical" gap="normal">
                <Stack direction="vertical" gap="gutter">
                  <Stack direction="vertical" gap="xsmall">
                    <Typography variant="heading-01">{t('in-plg:buyNowDialog.mainBodyTitle1')}</Typography>
                    <Typography variant="body-01">{t('in-plg:buyNowDialog.mainBodyDescription1')}</Typography>
                  </Stack>
                  <Stack direction="vertical" gap="xsmall">
                    <Typography variant="heading-01">{t('in-plg:buyNowDialog.mainBodyTitle2')}</Typography>
                    <Typography variant="body-01">{t('in-plg:buyNowDialog.mainBodyDescription2')}</Typography>
                  </Stack>
                </Stack>
                <Stack direction="vertical" gap="gutter">
                  <Ul>
                    <Li noAlternatingBg>
                      <CellContent variant="heading-01" content={t('in-plg:buyNowDialog.listTitle1')} />
                      <CellContent variant="heading-01" content={t('in-plg:buyNowDialog.listTitle2')} />
                      <CellContent variant="heading-01" content={t('in-plg:buyNowDialog.listTitle3')} />
                    </Li>
                    <Li noAlternatingBg>
                      <CellContent variant="body-01" content={t('in-plg:buyNowDialog.listUnit1')} />
                      <CellContent variant="body-01" content={t('in-plg:buyNowDialog.listDescription1')} />
                      <CellContent variant="body-01" content={t('in-plg:buyNowDialog.listCost1')} />
                    </Li>
                    <Li noAlternatingBg>
                      <CellContent variant="body-01" content={t('in-plg:buyNowDialog.listUnit2')} />
                      <CellContent variant="body-01" content={t('in-plg:buyNowDialog.listDescription2')} />
                      <CellContent variant="body-01" content={t('in-plg:buyNowDialog.listCost2')} />
                    </Li>
                  </Ul>
                  <Typography variant="body-01">
                    {t('in-plg:buyNowDialog.learnMore')}
                    <Link target="_blank" href="https://www.ibm.com/support/customer/csol/terms/?id=i126-8959&lc=en">
                      {t('in-plg:buyNowDialog.serviceDescription')}
                    </Link>
                  </Typography>
                  <Typography variant="body-01">
                    {t('in-plg:buyNowDialog.mvs')}
                    <Link
                      target="_blank"
                      href="https://www.ibm.com/products/instana/pricing#Frequently+asked+questions"
                    >
                      {t('in-plg:buyNowDialog.here')}
                    </Link>
                  </Typography>
                </Stack>
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
                  const data = { type: 'quote' };
                  triggerSegmentEvent(data);
                }}
              >
                {t('in-plg:licenseBanner.requestQuoteBtn')}
              </Link>
            </Stack>
          </div>
        </Stack>
      </div>
      <div className={locals.dialogButton}>
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
            rel="noopener noreferrer"
            onClick={() => {
              const data = { type: 'aws' };
              triggerSegmentEvent(data);
            }}
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
            rel="noopener noreferrer"
            onClick={() => {
              const data = { type: 'ibm' };
              triggerSegmentEvent(data);
            }}
          >
            {t('in-plg:licenseBanner.buyNowBtnIbm')}
          </LicenseBannerButton>
        </Stack>
      </div>
    </Dialog>
  );
};

const CellContent = ({ content, variant }: { content: string; variant: 'body-01' | 'heading-01' }) => (
  <div className={locals.tableContent}>
    <Typography variant={variant}>{content}</Typography>
  </div>
);
