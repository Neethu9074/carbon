/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { t } from '@instana/i18n-react';

export function CommunityBlogsData() {
  return [
    {
      key: 'gettingStartedblog',
      title: t('in-plg:onboarding.communityblogs.gettingStartedBlogTitle'),
      description: t('in-plg:onboarding.communityblogs.gettingStartedBlogDescription'),
      href: 'https://community.ibm.com/community/user/blogs/ciaran-darcy/2025/04/28/getting-started-with-instana'
    },
    {
      key: 'initialDeploymentblog',
      title: t('in-plg:onboarding.communityblogs.initialDeploymentBlogTitle'),
      description: t('in-plg:onboarding.communityblogs.initialDeploymentBlogDescription'),
      href: 'https://community.ibm.com/community/user/blogs/ciaran-darcy/2025/04/28/instanadeployment'
    }
  ];
}
