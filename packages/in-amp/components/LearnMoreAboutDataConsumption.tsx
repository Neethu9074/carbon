/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { ExpandableGroup, Typography, Stack, Link } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { getExpandState, setExpandState } from 'in-plg/components/DataConsumptionMessage/PushDataConsumptionMessage';
import { FAIR_USE_POLICY_BLOG, CONTACT_SALES } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { t, Trans } from 'in-i18n';

import locals from 'in-amp/components/LearnMoreAboutDataConsumption.mless';

export default function LearnMoreAboutDataConsumption() {
  /**
   * When the user reaches this component via button on data consumption notification it should be expanded.
   * When the user reaches this component in any other way it will be collapsed
   */
  useEffect(() => {
    return () => {
      setExpandState(false);
    };
  }, []);

  const { trackCta } = useSegmentTracking();

  return (
    <div className={locals.learnMore}>
      <ExpandableGroup title={t('in-amp:components.learnMore.title')} expanded={getExpandState()}>
        <div className={locals.accordionBody}>
          <Stack direction="vertical">
            <Typography variant="body-bold">{t('in-amp:components.learnMore.leftTitle')}</Typography>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-amp:components.learnMore.leftBody"
                components={{
                  fupDocLink: (
                    //@ts-expect-error children not added
                    <Link
                      href="https://ibm.biz/fair-use-policy"
                      onClick={() => trackCta(FAIR_USE_POLICY_BLOG)}
                      external
                    />
                  )
                }}
              />
            </Typography>
          </Stack>
          <Stack direction="vertical">
            <Typography variant="body-bold">{t('in-amp:components.learnMore.rightTitle')}</Typography>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-amp:components.learnMore.rightBody"
                components={{
                  salesLink: (
                    //@ts-expect-error children not added
                    <Link
                      href="https://www.ibm.com/account/reg/us-en/signup?formid=QTE-automateinstana&utm_source=instanaproduct"
                      onClick={() => trackCta(CONTACT_SALES)}
                      external
                    />
                  )
                }}
              />
            </Typography>
          </Stack>
        </div>
      </ExpandableGroup>
    </div>
  );
}
