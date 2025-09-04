/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const getSupportLinks = t => [
  {
    id: 'docs',
    title: t('in-server:solis.helpPanel.supportLinks.docs'),
    icon_name: 'document',
    href: 'https://www.ibm.com/docs/en/instana-observability/current'
  },
  {
    id: 'community',
    title: t('in-server:solis.helpPanel.supportLinks.community'),
    icon_name: 'bee',
    href: 'https://community.ibm.com/community/user/groups/community-home'
  },
  {
    id: 'support-ticket',
    title: t('in-server:solis.helpPanel.supportLinks.support'),
    icon_name: 'help-desk',
    href: 'https://www.ibm.com/mysupport/s/?language=en_US'
  }
];

const linkList = t =>
  getSupportLinks(t).map(config => ({
    id: config.id,
    kind: 'secondary',
    icon_name: config.icon_name,
    title: config.title,
    action: {
      type: 'link',
      href: config.href,
      target: '_blank'
    }
  }));

module.exports = linkList;
