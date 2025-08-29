/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ExpandableTile, HStack, Stack, TileAboveTheFoldContent, TileBelowTheFoldContent } from '@instana/carbon';
import { Typography } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-plg/components/Banner/Banner.mless';

interface BannerProps {
  label?: string;
  heading: string;
  expanded?: boolean;
  expandedContentLeft: JSX.Element;
  expandedContentRight: JSX.Element;
}

const Banner = ({
  label = t('in-plg:Components.Banner.howToGetStarted'),
  heading,
  expanded = false,
  expandedContentLeft,
  expandedContentRight
}: BannerProps) => {
  return (
    <ExpandableTile expanded={expanded}>
      <TileAboveTheFoldContent>
        <Stack gap={1}>
          <Typography variant="label-01">{label}</Typography>
          <Typography variant="heading-03">{heading}</Typography>
        </Stack>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <HStack className={locals.expandedContent} gap={9}>
          {expandedContentLeft}
          {expandedContentRight}
        </HStack>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
};

export default Banner;
