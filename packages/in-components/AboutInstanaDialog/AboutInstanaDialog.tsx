/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Typography, Link, Stack } from '@instana/components';
import { AboutModal } from '@instana/ibm-products';
import { useObservable } from '@instana/hooks';

import { graphViewFromAboutInstanaEnabled } from 'in-services/featureFlags';
import instanaLogo from 'in-components/AboutInstanaDialog/Instana.svg?url';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { close } from 'in-components/DialogPresenter/store';
import { instanaRegion, build } from 'in-services/config';
import { t } from 'in-i18n';

import locals from './AboutInstanaDialog.mless';

export default function AboutInstanaDialog() {
  const uiBackendVersion: { imageTag: string; commit: string } = useObservable(
    getUiBackendVersion('getInstanaVersion'),
    []
  ) as { imageTag: string; commit: string };
  const { createHrefToPath } = useNavigation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AboutModal
      open={isOpen}
      closeIconDescription={t('in-components:aboutInstanaDialog.close')}
      content={
        <span className={locals.fontColor}>
          <Stack component={'span'} gap="large" direction="vertical" align="start">
            {instanaRegion && (
              <Stack component={'span'} gap="xxsmall" direction="vertical" align="start">
                <Typography component={'span'} variant="heading-03">
                  {t('in-components:aboutInstanaDialog.columnizedContentDeployment')}
                </Typography>
                <Typography component={'span'} noMargin variant="heading-01">
                  {t('in-components:aboutInstanaDialog.labelRegion')}
                </Typography>
                {instanaRegion}
              </Stack>
            )}
            <Stack component={'span'} gap="small" direction="vertical" align="start">
              <Typography component={'span'} variant="heading-03">
                {t('in-components:aboutInstanaDialog.columnizedContentUserInterface')}
              </Typography>
              {build.tag && (
                <Stack component={'span'} gap="disabled">
                  <Typography component={'span'} noMargin variant="heading-01">
                    {t('in-components:aboutInstanaDialog.labelTag')}
                  </Typography>
                  <Typography component={'span'} variant="body-01">
                    {build.tag}
                  </Typography>
                </Stack>
              )}

              {build.revision && (
                <Stack component={'span'} gap="disabled">
                  <Typography component={'span'} noMargin variant="heading-01">
                    {t('in-components:aboutInstanaDialog.labelCommit')}
                  </Typography>
                  <Typography component={'span'} variant="body-01">
                    {build.revision.substring(0, 12)}
                  </Typography>
                </Stack>
              )}
            </Stack>
            {uiBackendVersion && (
              <Stack component={'span'} gap="small" direction="vertical" align="start">
                (
                <>
                  <Typography component={'span'} variant="heading-03">
                    {t('in-components:aboutInstanaDialog.columnizedContentBackend')}
                  </Typography>
                  <Stack component={'span'} gap="disabled">
                    <Typography component={'span'} noMargin variant="heading-01">
                      {t('in-components:aboutInstanaDialog.labelTag')}
                    </Typography>
                    <Typography component={'span'} variant="body-01">
                      {' '}
                      {uiBackendVersion?.imageTag}
                    </Typography>
                  </Stack>
                  <Stack component={'span'} gap="disabled">
                    <Typography component={'span'} noMargin variant="heading-compact-01">
                      {t('in-components:aboutInstanaDialog.labelCommit')}
                    </Typography>
                    <Typography component={'span'} variant="body-01">
                      {uiBackendVersion?.commit?.substring(0, 12)}
                    </Typography>
                  </Stack>
                </>
                )
              </Stack>
            )}
            <Stack component={'span'} gap="small" direction="vertical" align="start">
              <Typography component={'span'} variant="heading-03">
                {t('in-components:aboutInstanaDialog.geo.title')}
              </Typography>
              <Typography component={'span'} variant="body-01">
                {t('in-components:aboutInstanaDialog.maxMindDescription')}{' '}
                <Link href="https://www.maxmind.com" linkIconType="lib_views_external_link">
                  {t('in-components:aboutInstanaDialog.maxMind')}
                </Link>
              </Typography>
              {graphViewFromAboutInstanaEnabled && (
                <Typography component={'span'} variant="body-01">
                  {t('in-components:aboutInstanaDialog.dynamicGraphDescription')}{' '}
                  <Link href={createHrefToPath(graphPath)} onClick={() => close()} inline>
                    {t('in-components:aboutInstanaDialog.dynamicGraph')}
                  </Link>
                </Typography>
              )}
            </Stack>
          </Stack>
        </span>
      }
      copyrightText={t('in-components:aboutInstanaDialog.copyRights')}
      logo={<img alt="IBM Instana logo" src={instanaLogo} width="96" height="96" />}
      modalAriaLabel="About this product"
      onClose={() => {
        close();
        setIsOpen(false);
      }}
      title={
        <span className={locals.alignTitle}>
          {t('in-components:aboutInstanaDialog.ibm')}&nbsp;
          <span className={locals.fontWeight}>{t('in-components:aboutInstanaDialog.instana')}</span>
        </span>
      }
      version=""
    />
  );
}
