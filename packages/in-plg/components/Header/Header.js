/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';

import GoogleCloudIcon from 'in-plg/pages/onboarding/icons/GoogleCloudIcon';
import CloudFoundryIcon from 'in-plg/pages/onboarding/icons/CloudFoundry';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import AwsIcon from 'in-plg/pages/onboarding/icons/AwsIcon';

import locals from './Header.mless';

const IconSwitch = ({ icon }) => {
  //handling the case of custom icons for tech
  switch (icon) {
    case 'google_cloud_icon':
      return <GoogleCloudIcon />;
    case 'aws_icon':
      return <AwsIcon />;
    case 'cloud_foundry_icon':
      return <CloudFoundryIcon />;
    default:
      return <SvgIcon type={icon} />;
  }
};

const AgentInstallBreadCrumbs = crumbs => {
  let content = crumbs.map((item, index) => {
    const isLastItem = index === crumbs.length - 1;
    const textClass = isLastItem ? 'body-bold' : 'body-regular';
    return (
      <Breadcrumb href={item.href} key={index} className={locals.breadcrumb}>
        <Stack direction="horizontal" align="center">
          <IconSwitch icon={item.icon} />
          <Typography variant={textClass}>{item.title}</Typography>
        </Stack>
      </Breadcrumb>
    );
  });
  return content;
};

const Header = ({ crumbs }) => {
  return (
    <>
      <BreadcrumbHeader />
      <Breadcrumbs items={AgentInstallBreadCrumbs(crumbs)} />
    </>
  );
};

export default Header;
