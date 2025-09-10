/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

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
  onCollapseFunc?: (() => void) | null;
  onExpandFunc?: (() => void) | null;
}

const Banner = ({
  label = t('in-plg:Components.Banner.howToGetStarted'),
  heading,
  expanded = false,
  expandedContentLeft,
  expandedContentRight,
  onCollapseFunc = null,
  onExpandFunc = null
}: BannerProps) => {
  const [expandInternalState, setExpandInternalState] = useState(expanded);

  return (
    <ExpandableTile
      expanded={expandInternalState}
      onClick={() => {
        const newState = !expandInternalState;
        setExpandInternalState(newState);

        if (!newState && onCollapseFunc) {
          onCollapseFunc();
        } else if (newState && onExpandFunc) {
          onExpandFunc();
        }
      }}
    >
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
