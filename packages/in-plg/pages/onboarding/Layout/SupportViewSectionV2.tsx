/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { Link, Stack } from '@instana/carbon';

import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

interface SupportViewSectionV2 {
  title: string;
  links: { title: string; href: string; trackingEvent?: string }[];
}

const SupportViewSectionV2 = ({ items }: { items: SupportViewSectionV2[] }) => {
  const { trackCta } = useSegmentTracking();
  return (
    <Stack gap="20px">
      {items.map((item, index) => (
        <Stack key={index} gap="20px">
          <Typography variant="body-bold">{item.title}</Typography>
          <Stack gap="16px">
            {item.links.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                href={link.href}
                target="_blank"
                onClick={() => link.trackingEvent && trackCta(link.trackingEvent)}
                renderIcon={() => <SvgIcon type="lib_views_external_link" size="xs" />}
              >
                {link.title}
              </Link>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default SupportViewSectionV2;
