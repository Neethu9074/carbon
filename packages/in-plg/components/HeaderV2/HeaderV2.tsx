/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Breadcrumb, BreadcrumbItem } from '@instana/carbon';
import { Typography } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

import locals from 'in-plg/components/HeaderV2/HeaderV2.mless';

interface breadcrumb {
  title: string;
  href: string | null;
}

interface HeaderV2 {
  breadcrumb: breadcrumb[];
  title: string;
}

const HeaderV2 = ({ breadcrumb, title }: HeaderV2) => {
  const { createHrefToPath } = useNavigation();
  return (
    <div className={locals.wrapper}>
      <Stack gap={4}>
        {breadcrumb.length && (
          <Breadcrumb>
            {breadcrumb.map((item, index) => {
              let href = item.href;
              return (
                <BreadcrumbItem key={index} {...(href ? { href: createHrefToPath(href) } : {})}>
                  {item?.title}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        )}
        <Typography variant="heading-04">{title}</Typography>
      </Stack>
    </div>
  );
};

export default HeaderV2;
