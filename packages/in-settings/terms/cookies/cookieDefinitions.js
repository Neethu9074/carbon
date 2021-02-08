/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const cookieDefinitions = [
  {
    key: 'allAnalyticsServices',
    title: 'Product User Analytics',
    cookieProduct: 'Mixpanel',
    details: [
      {
        category: 'Analytical / Performance',
        name: 'mp_[ID]_mixpanel',
        purpose: 'Registers a unique ID that is used to generate statistical data on how the visitor uses the website.',
        moreInformation: 'Expires after 7 days'
      }
    ]
  },
  {
    key: 'allSupportAndResearchServices',
    title: 'Tailored Onboarding Experience and NPS Surveys',
    cookieProduct: 'Appcues',
    details: [
      {
        category: 'Functionality',
        name: 'apc_local_id',
        purpose: 'User Onboarding and NPS store survey.',
        moreInformation: 'Persistent'
      },
      {
        category: 'Functionality',
        name: 'apc_user_id',
        purpose: 'User Onboarding and NPS store survey.',
        moreInformation: 'Persistent'
      },
      {
        category: 'Functionality',
        name: 'apc_my_id',
        purpose: 'User Onboarding and NPS store survey.',
        moreInformation: 'Expires after session'
      },
      {
        category: 'Functionality',
        name: 'apc_my_id_ts',
        purpose: 'User Onboarding and NPS store survey.',
        moreInformation: 'Expires after session'
      },
      {
        category: 'Functionality',
        name: 'apc_user',
        purpose: 'User Onboarding and NPS store survey.',
        moreInformation: 'Expires after session'
      }
    ]
  }
];
