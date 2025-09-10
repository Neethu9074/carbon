/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { ExpandableGroup, Typography, Stack, Link } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { getExpandState, setExpandState } from 'in-plg/components/DataConsumptionMessage/PushDataConsumptionMessage';
import { t, Trans } from 'in-i18n';

import locals from 'in-amp/components/LearnMoreAboutDataGranularity.mless';

export default function LearnMoreAboutDataGranularity() {
  /**
   * When the user reaches this component via button on data consumption notification it should be expanded.
   * When the user reaches this component in any other way it will be collapsed
   */
  useEffect(() => {
    return () => {
      setExpandState(false);
    };
  }, []);

  return (
    <div className={locals.learnMore}>
      <ExpandableGroup title={t('in-amp:fairUsePolicy.learnMoreDataGranularity.learnMore')} expanded={getExpandState()}>
        <div className={locals.accordionBody}>
          <Stack direction="vertical">
            <Typography variant="body-bold">{t('in-amp:fairUsePolicy.learnMoreDataGranularity.leftTitle')}</Typography>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-amp:fairUsePolicy.learnMoreDataGranularity.leftBody"
                components={{
                  fupDocLink: (
                    //@ts-expect-error children not added
                    <Link href="https://ibm.biz/fair-use-policy" external />
                  )
                }}
              />
            </Typography>
          </Stack>
          <Stack direction="vertical">
            <Typography variant="body-bold">{t('in-amp:fairUsePolicy.learnMoreDataGranularity.rightTitle')}</Typography>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-amp:fairUsePolicy.learnMoreDataGranularity.rightBody"
                components={{
                  salesLink: (
                    //@ts-expect-error children not added
                    <Link
                      href="https://community.ibm.com/community/user/viewdocument/ask-the-expert-data-usage-and-optim?CommunityKey=8d661410-d1fb-4067-ab9a-019475fc541e&tab=librarydocuments"
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
