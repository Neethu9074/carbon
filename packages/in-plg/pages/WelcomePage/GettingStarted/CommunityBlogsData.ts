/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { t } from '@instana/i18n-react';

import { BLOG_GETTINGSTARTED, BLOG_INITIALDEPLOYMENTSTEP } from 'in-services/tracking/eventNames';
export function CommunityBlogsData() {
  return [
    {
      key: 'gettingStartedblog',
      title: t('in-plg:onboarding.communityblogs.gettingStartedBlogTitle'),
      description: t('in-plg:onboarding.communityblogs.gettingStartedBlogDescription'),
      href: 'https://ibm.biz/Getting-Started-with-Instana',
      trackingEvent: BLOG_GETTINGSTARTED
    },
    {
      key: 'initialDeploymentblog',
      title: t('in-plg:onboarding.communityblogs.initialDeploymentBlogTitle'),
      description: t('in-plg:onboarding.communityblogs.initialDeploymentBlogDescription'),
      href: 'https://ibm.biz/Instana-Initial-Deployment-steps',
      trackingEvent: BLOG_INITIALDEPLOYMENTSTEP
    }
  ];
}
