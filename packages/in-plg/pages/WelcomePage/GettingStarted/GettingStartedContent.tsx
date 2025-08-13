/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';
import { ArrowRight, Launch } from '@carbon/icons-react';

import { ExpressiveCard } from '@instana/ibm-products';
import { Typography } from '@instana/components';
import { Button, Stack } from '@instana/carbon';
import { t } from '@instana/i18n-react';

import { OnboardingTileData } from 'in-plg/pages/WelcomePage/GettingStarted/OnboardingTileData';
import { CommunityBlogsData } from 'in-plg/pages/WelcomePage/GettingStarted/CommunityBlogsData';
import { GuidedVideoItems } from 'in-plg/pages/WelcomePage/GettingStarted/GuidedVideoItems';
import { ContentSection } from 'in-plg/pages/WelcomePage/GettingStarted/ContentSection';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import SupportViewSectionV2 from 'in-plg/pages/onboarding/Layout/SupportViewSectionV2';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

import locals from './GettingStartedContent.mless';

const supportResourceData = [
  {
    title: t('in-plg:onboarding.resource.title'),
    links: [
      {
        title: t('in-plg:onboarding.resource.tryInstanaWithSampleData'),
        href: 'https://play-with.instana.io/'
      },
      {
        title: t('in-plg:onboarding.resource.ibmDocumentation'),
        href: 'https://ibm.biz/instana-release-301'
      },
      {
        title: t('in-plg:onboarding.resource.community'),
        href: 'https://ibm.biz/Instana-Homepage'
      },
      {
        title: t('in-plg:onboarding.resource.getSupport'),
        href: 'https://ibm.biz/Support-Troubleshooting'
      }
    ]
  }
];

const watchDemoVideoId = 'KpyMsT7cLa8';

export default function GettingStartedContent() {
  const { trackCta } = useSegmentTracking();
  const onboardingItems = OnboardingTileData();
  const communityBlogsData = CommunityBlogsData();
  const videoList = GuidedVideoItems();

  return (
    <Container>
      <MainBody>
        <ContentSection title={t('in-plg:onboarding.title')} description={t('in-plg:onboarding.description')}>
          <div className={locals.tileGrid}>
            {onboardingItems.map(item => (
              <ExpressiveCard
                key={item.key}
                label={<Typography variant="label-01">{t('in-plg:onboarding.taskLabel')}</Typography>}
                title={<Typography variant="heading-03"> {item.title}</Typography>}
                pictogram={item.pictogram}
                onClick={() => {
                  trackCta(item.trackingEvent);
                  if (item.target === '_blank') {
                    window.open(item.href, '_blank');
                  } else {
                    window.location.href = item.href;
                  }
                }}
                actionIcons={[
                  {
                    id: item.key,
                    icon: () => <ArrowRight />,
                    iconDescription: item.title
                  }
                ]}
              />
            ))}
          </div>
        </ContentSection>

        <ContentSection title={t('in-plg:onboarding.videotitle')} description={t('in-plg:onboarding.videoDescription')}>
          <div className={locals.tileGrid}>
            {videoList.map(item => (
              <ExpressiveCard
                key={item.title}
                title={item.title}
                label={t('in-plg:onboarding.video')}
                onClick={() => {
                  window.open(`https://www.youtube.com/watch?v=${item.embedId}`, '_blank');
                }}
                actionIcons={[
                  {
                    id: item.title,
                    icon: () => <ArrowRight />,
                    iconDescription: item.title
                  }
                ]}
                media={
                  <img src={`https://img.youtube.com/vi/${item.embedId}/hqdefault.jpg`} className={locals.image} />
                }
              />
            ))}
          </div>
        </ContentSection>

        <ContentSection
          title={t('in-plg:onboarding.communityblogs.title')}
          description={t('in-plg:onboarding.communityblogs.description')}
        >
          <Stack gap="1rem">
            <div className={locals.communityBlogtileGrid}>
              {communityBlogsData.map(item => (
                <ExpressiveCard
                  key={item.key}
                  label={<Typography variant="label-01">{t('in-plg:onboarding.communityblogs.blogLabel')}</Typography>}
                  title={<Typography variant="heading-03"> {item.title}</Typography>}
                  description={<Typography variant="body-02">{item.description}</Typography>}
                  onClick={() => {
                    window.open(item.href, '_blank');
                  }}
                  actionIcons={[
                    {
                      id: item.key,
                      icon: () => <Launch />,
                      iconDescription: item.title
                    }
                  ]}
                />
              ))}
            </div>
            <Button
              kind="ghost"
              icon="lib_arrow_right"
              onClick={() => {
                window.open('https://ibm.biz/Instana-Homepage', '_blank', 'noreferrer');
              }}
            >
              {t('in-plg:onboarding.joinCommunityLink')}
            </Button>
          </Stack>
        </ContentSection>
      </MainBody>
      <SidePanel className={locals.sidePanel}>
        <Stack gap="2rem">
          <ExpressiveCard
            key={t('in-plg:onboarding.resource.watchADemo')}
            title={t('in-plg:onboarding.resource.watchADemo')}
            label={t('in-plg:onboarding.video')}
            onClick={() => {
              window.open(`https://www.youtube.com/watch?v=${watchDemoVideoId}`, '_blank');
            }}
            actionIcons={[
              {
                id: t('in-plg:onboarding.resource.watchADemo'),
                icon: () => <ArrowRight />,
                iconDescription: t('in-plg:onboarding.resource.watchADemo')
              }
            ]}
            media={
              <img src={`https://img.youtube.com/vi/${watchDemoVideoId}/hqdefault.jpg`} className={locals.image} />
            }
          />
          <SupportViewSectionV2 items={supportResourceData} />
        </Stack>
      </SidePanel>
    </Container>
  );
}
