/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useState, useEffect } from 'react';
import { ArrowRight, Launch, Checkmark } from '@carbon/icons-react';

import { ExpressiveCard } from '@instana/ibm-products';
import { Typography } from '@instana/components';
import { Button, Stack } from '@instana/carbon';
import { t } from '@instana/i18n-react';

import {
  JOIN_INSTANA_COMMUNITY,
  GETTINGSTARTED_LINK_TRY_INSTANA,
  GETTINGSTARTED_LINK_IBM_DOCUMENTATION,
  GETTINGSTARTED_LINK_COMMUNITY,
  GETTINGSTARTED_LINK_GETSUPPORT,
  VIDEO_WATCHADEMO
} from 'in-services/tracking/eventNames';
import { useOnboardingTileData } from 'in-plg/pages/WelcomePage/GettingStarted/OnboardingTileData';
import { CommunityBlogsData } from 'in-plg/pages/WelcomePage/GettingStarted/CommunityBlogsData';
import { GuidedVideoItems } from 'in-plg/pages/WelcomePage/GettingStarted/GuidedVideoItems';
import { ContentSection } from 'in-plg/pages/WelcomePage/GettingStarted/ContentSection';
import VideoImage from 'in-plg/pages/WelcomePage/GettingStarted/assets/VideoImage.png';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import SupportViewSectionV2 from 'in-plg/pages/onboarding/Layout/SupportViewSectionV2';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import config from 'in-services/config';

import locals from './GettingStartedContent.mless';

const supportResourceData = [
  {
    title: t('in-plg:onboarding.resource.title'),
    links: [
      {
        title: t('in-plg:onboarding.resource.tryInstanaWithSampleData'),
        href: 'https://play-with.instana.io/',
        trackingEvent: GETTINGSTARTED_LINK_TRY_INSTANA
      },
      {
        title: t('in-plg:onboarding.resource.ibmDocumentation'),
        href: 'https://ibm.biz/instana-release-301',
        trackingEvent: GETTINGSTARTED_LINK_IBM_DOCUMENTATION
      },
      {
        title: t('in-plg:onboarding.resource.community'),
        href: 'https://ibm.biz/Instana-Homepage',
        trackingEvent: GETTINGSTARTED_LINK_COMMUNITY
      },
      {
        title: t('in-plg:onboarding.resource.getSupport'),
        href: 'https://ibm.biz/Support-Troubleshooting',
        trackingEvent: GETTINGSTARTED_LINK_GETSUPPORT
      }
    ]
  }
];
const watchDemoVideoId = 'KpyMsT7cLa8';

export default function GettingStartedContent({ activation }: { activation: any }) {
  const { trackCta } = useSegmentTracking();
  const communityBlogsData = CommunityBlogsData();
  const videoList = GuidedVideoItems();
  const currentTenantUnit = `${config.tenant}#${config.tenantUnit}`;
  const [statusFlags, setStatusFlags] = useState({
    firstAgentInstalled: true,
    tracingReported: true,
    threeAgentsInstalled: true,
    twoApplicationPerspectivesCreated: true,
    oneAlertSetUpAndActivated: true,
    oneWebsiteMonitored: true
  });

  useEffect(() => {
    if (!activation || Object.keys(activation).length === 0) return;

    setStatusFlags({
      firstAgentInstalled: activation[currentTenantUnit]?.fa?.status ?? true,
      tracingReported: activation[currentTenantUnit]?.tr?.status ?? true,
      threeAgentsInstalled: activation[currentTenantUnit]?.ai?.status ?? true,
      twoApplicationPerspectivesCreated: activation[currentTenantUnit]?.ap?.status ?? true,
      oneAlertSetUpAndActivated: activation[currentTenantUnit]?.sas?.status ?? true,
      oneWebsiteMonitored: activation[currentTenantUnit]?.w?.status ?? true
    });
  }, [activation, currentTenantUnit]);
  const { defaultTasks, completedTasks } = useOnboardingTileData(statusFlags);
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <Container>
      <MainBody>
        <ContentSection title={t('in-plg:onboarding.title')} description={t('in-plg:onboarding.description')}>
          <Stack gap={5}>
            <div className={locals.tileGrid}>
              {defaultTasks.map(item => (
                <ExpressiveCard
                  key={item.key}
                  label={t('in-plg:onboarding.taskLabel')}
                  title={item.title}
                  pictogram={item.pictogram}
                  onClick={() => {
                    trackCta(item.trackingEvent);
                    item.target === '_blank' ? window.open(item.href, '_blank') : (window.location.href = item.href);
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
              {showCompleted && <div className={locals.completed} />}
              {showCompleted &&
                completedTasks.map(item => (
                  <ExpressiveCard
                    key={item.key}
                    label={t('in-plg:onboarding.taskLabel')}
                    title={item.title}
                    pictogram={Checkmark}
                    onClick={() => {
                      trackCta(item.trackingEvent);
                      item.target === '_blank' ? window.open(item.href, '_blank') : (window.location.href = item.href);
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
            {completedTasks.length > 0 && (
              <Button kind="ghost" onClick={() => setShowCompleted(prev => !prev)}>
                {showCompleted ? t('in-plg:onboarding.hideCompleted') : t('in-plg:onboarding.showCompleted')}
              </Button>
            )}
          </Stack>
        </ContentSection>

        <ContentSection title={t('in-plg:onboarding.videotitle')} description={t('in-plg:onboarding.videoDescription')}>
          <div className={locals.tileGrid}>
            {videoList.map(item => (
              <ExpressiveCard
                key={item.title}
                title={item.title}
                label={t('in-plg:onboarding.video')}
                onClick={() => {
                  trackCta(item.trackingEvent);
                  window.open(`https://www.youtube.com/watch?v=${item.embedId}`, '_blank');
                }}
                actionIcons={[
                  {
                    id: item.title,
                    icon: () => <ArrowRight />,
                    iconDescription: t('in-plg:onboarding.tryNow')
                  }
                ]}
                media={<img src={VideoImage} alt="Visual" className={locals.image} />}
              />
            ))}
          </div>
        </ContentSection>

        <ContentSection
          title={t('in-plg:onboarding.communityblogs.title')}
          description={t('in-plg:onboarding.communityblogs.description')}
        >
          <Stack gap={5}>
            <div className={locals.communityBlogtileGrid}>
              {communityBlogsData.map(item => (
                <ExpressiveCard
                  key={item.key}
                  label={t('in-plg:onboarding.communityblogs.blogLabel')}
                  title={item.title}
                  description={<Typography variant="body-02">{item.description}</Typography>}
                  onClick={() => {
                    trackCta(item.trackingEvent);
                    window.open(item.href, '_blank');
                  }}
                  actionIcons={[
                    {
                      id: item.key,
                      icon: () => <Launch />,
                      iconDescription: t('in-plg:onboarding.LearnMore')
                    }
                  ]}
                />
              ))}
            </div>
            <Button
              kind="ghost"
              icon="lib_arrow_right"
              onClick={() => {
                trackCta(JOIN_INSTANA_COMMUNITY);
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
            key={t('in-plg:onboarding.resource.seeInstanaInAction')}
            title={t('in-plg:onboarding.resource.seeInstanaInAction')}
            label={t('in-plg:onboarding.video')}
            onClick={() => {
              trackCta(VIDEO_WATCHADEMO);
              window.open(`https://www.youtube.com/watch?v=${watchDemoVideoId}`, '_blank');
            }}
            actionIcons={[
              {
                id: t('in-plg:onboarding.resource.seeInstanaInAction'),
                icon: () => <ArrowRight />,
                iconDescription: t('in-plg:onboarding.tryNow')
              }
            ]}
            media={<img src={VideoImage} alt="Visual" className={locals.image} />}
          />
          <SupportViewSectionV2 items={supportResourceData} />
        </Stack>
      </SidePanel>
    </Container>
  );
}
