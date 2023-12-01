/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';

import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

const AgentInstallBreadCrumbs = crumbs => {
  let content = crumbs.map((ele, index) => {
    const isLastItem = index === crumbs.length - 1;
    const textClass = isLastItem ? 'body-bold' : 'body-regular';
    return (
      <Breadcrumb href={'#/agents/installation'} key={index}>
        <Stack direction="horizontal" align="center">
          <SvgIcon type={ele.icon} />
          <Typography variant={textClass}>{ele.title}</Typography>
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
