/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Spacer, Typography, Link } from '@instana/components';
import { Button, Stack, Tag } from '@instana/carbon';

import {
  KUBECOST_BANNER_CONFIGURE_NOW_CLICK,
  KUBECOST_BANNER_LEARN_MORE_CLICK,
  KUBECOST_BANNER_UPGRAGE_NOW_CLICK
} from 'in-services/tracking/eventNames';
// eslint-disable-next-line no-restricted-imports
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import BannerSvg from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Banner.svg';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import LogoSvg from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Logo.svg';
import { tryGet, trySet } from 'in-services/localStorage';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Banner.mless';

interface CTA {
  label: string;
  href?: string;
  target?: '_blank' | undefined;
  onClick?: () => void;
}

export interface IBannerProps {
  targetProductName: string;
  variation: string;
  headline: string;
  tag: string;
  description: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
  stickyTitle?: boolean;
  collapsible?: boolean;
  expanded?: string | boolean;
  showLabel?: string;
}

export default function Banner({
  targetProductName,
  expanded = true,
  collapsible = true,
  headline,
  tag,
  description,
  showLabel,
  primaryCta,
  secondaryCta
}: IBannerProps) {
  const [isExpanded, setIsExpanded] = useState(
    typeof expanded === 'string' ? (tryGet(expanded) ?? 'true') === 'true' : expanded
  );
  const { trackCta } = useSegmentTracking();

  const toggleVisibility = () => {
    setIsExpanded((prev: boolean) => {
      if (typeof expanded === 'string') {
        trySet(expanded, !prev ? 'true' : 'false');
      }
      return !prev;
    });
  };

  return (
    <>
      <section className={locals.bannerSection}>
        {isExpanded && (
          <Stack orientation="horizontal" className={locals.banner}>
            <div>
              <div className={locals.leftSideConrainer}>
                <div className={locals.product}>
                  <LogoSvg />
                  <Typography variant="body-02">{`IBM ${targetProductName}`}</Typography>
                  {tag && (
                    <Tag size="sm" type="blue">
                      <div>{tag}</div>
                    </Tag>
                  )}
                </div>
                <Spacer size="normal" />
                <Typography variant="heading-03">{headline}</Typography>
                <Typography variant="body-compact-01">
                  <span className={locals.cutOffText}>{description}</span>
                </Typography>
                <Spacer size="normal" />
                <Button
                  kind="tertiary"
                  href={primaryCta?.href}
                  onClick={() => {
                    primaryCta?.onClick?.();
                    if (primaryCta?.label === t('in-kubernetes:dashboards.kubecost.configureNow')) {
                      trackCta(KUBECOST_BANNER_CONFIGURE_NOW_CLICK);
                    } else {
                      trackCta(KUBECOST_BANNER_UPGRAGE_NOW_CLICK);
                    }
                  }}
                  renderIcon={() => <IconForButton icon="lib_arrow_right" iconSize="xs" />}
                  size="sm"
                  target={primaryCta?.target}
                >
                  {primaryCta?.label}
                </Button>
                <Spacer size="normal" />
                <Link
                  href={secondaryCta?.href}
                  external
                  linkIconType="lib_arrow_short_right"
                  onClick={() => {
                    secondaryCta?.onClick?.();
                    trackCta(KUBECOST_BANNER_LEARN_MORE_CLICK);
                  }}
                >
                  {secondaryCta?.label}
                </Link>
              </div>
            </div>
            <div className={locals.illustration}>
              <BannerSvg />
            </div>
          </Stack>
        )}
        {collapsible && (
          <div id="bannerFooter" className={locals.buttonSection}>
            <Button
              kind="ghost"
              size="sm"
              className={locals.hideButton}
              renderIcon={() => (
                <IconForButton icon={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} iconSize="s" />
              )}
              onClick={toggleVisibility}
            >
              <span>{isExpanded ? t('in-kubernetes:dashboards.kubecost.hideTask') : showLabel}</span>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
