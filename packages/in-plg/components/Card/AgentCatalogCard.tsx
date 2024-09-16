/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { Card } from '@instana/components';

import GoogleCloudIcon from 'in-plg/pages/onboarding/icons/GoogleCloudIcon';
import CloudFoundryIcon from 'in-plg/pages/onboarding/icons/CloudFoundry';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import AwsIcon from 'in-plg/pages/onboarding/icons/AwsIcon';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-plg/components/Card/AgentCatalogCard.mless';

export default function AgentCatalogCard({
  title,
  icon,
  content,
  href
}: {
  title: string;
  icon: string;
  content?: string;
  href: string;
}) {
  const { goToPath } = useNavigation();

  const IconSwitch = ({ icon }: { icon: string }) => {
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

  return (
    <Card className={locals.card} onHeaderBackgroundClicked={() => goToPath(href)} bodyClassName={locals.bodyClassName}>
      <div className={locals.cardWrapper} onClick={() => goToPath(href)}>
        <Stack direction="horizontal">
          <Stack direction="vertical">
            <IconSwitch icon={icon} />
          </Stack>
          <Stack direction="vertical" gap="xxsmall">
            <Typography variant="body-bold">{title}</Typography>
            <Tooltip content={content} align="auto">
              <div>
                <Typography noWrap variant="body-regular">
                  {content}
                </Typography>
              </div>
            </Tooltip>
          </Stack>
        </Stack>
      </div>
    </Card>
  );
}
