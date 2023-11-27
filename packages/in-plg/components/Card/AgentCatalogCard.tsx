/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { Card } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-plg/components/Card/AgentCatalogCard.mless';

export default function AgentCatalogCard({
  title,
  icon,
  iconColor,
  content,
  href
}: {
  title: string;
  icon: string;
  iconColor?: string;
  content?: string;
  href: string;
}) {
  const { goToPath } = useNavigation();

  return (
    <Card className={locals.card}>
      <div onClick={() => goToPath(href)}>
        <Stack direction="horizontal">
          <Stack direction="vertical">
            <SvgIcon type={icon} color={iconColor ? iconColor : ''} />
          </Stack>
          <Stack direction="vertical" gap="xxsmall">
            <Typography variant="body-bold">{title}</Typography>
            <Tooltip content={content} align="bottomLeft">
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
