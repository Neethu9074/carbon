/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Ul, Li, KeyValue, Button, Stack, Link } from '@instana/components';
import { useObservable } from '@instana/hooks';

import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { close } from 'in-components/DialogPresenter/store';
import { instanaRegion } from 'in-services/config';
import Dialog from 'in-components/Dialog/Dialog';
import { goToPath } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import { build } from 'in-services/config';
import { t, Trans } from 'in-i18n';

import locals from './AboutInstanaDialog.mless';

export default function AboutInstanaDialog() {
  const uiBackendVersion = useObservable(getUiBackendVersion(), []);
  return (
    <Dialog onClose={close} title={<Lettering className={locals.lettering} />}>
      <Stack align="center" space="medium">
        <Ul>
          {instanaRegion && (
            <Li>
              <ColumnizedContent
                columnDefinitions={[
                  {
                    width: '10rem',
                    getContent() {
                      return t('in-components:aboutInstanaDialog.columnizedContentDeployment');
                    }
                  },
                  {
                    width: '8rem',
                    getContent() {
                      return (
                        <KeyValue
                          label={t('in-components:aboutInstanaDialog.labelRegion')}
                          value={instanaRegion}
                          accentuated
                        />
                      );
                    }
                  }
                ]}
              />
            </Li>
          )}

          <Li>
            <ColumnizedContent
              columnDefinitions={[
                {
                  width: '10rem',
                  getContent() {
                    return t('in-components:aboutInstanaDialog.columnizedContentUserInterface');
                  }
                },
                {
                  width: '8rem',
                  getContent() {
                    return (
                      build.tag && (
                        <KeyValue
                          label={t('in-components:aboutInstanaDialog.labelTag')}
                          value={build.tag}
                          accentuated
                        />
                      )
                    );
                  }
                },
                {
                  width: '8rem',
                  getContent() {
                    return (
                      build.revision && (
                        <KeyValue
                          label={t('in-components:aboutInstanaDialog.labelCommit')}
                          value={build.revision.substring(0, 12)}
                          accentuated
                        />
                      )
                    );
                  }
                }
              ]}
            />
          </Li>

          {uiBackendVersion && (
            <Li>
              <ColumnizedContent
                columnDefinitions={[
                  {
                    width: '10rem',
                    getContent() {
                      return t('in-components:aboutInstanaDialog.columnizedContentBackend');
                    }
                  },
                  {
                    width: '8rem',
                    getContent() {
                      return (
                        uiBackendVersion.imageTag && (
                          <KeyValue
                            label={t('in-components:aboutInstanaDialog.labelTag')}
                            value={uiBackendVersion.imageTag}
                            accentuated
                          />
                        )
                      );
                    }
                  },
                  {
                    width: '8rem',
                    getContent() {
                      return (
                        uiBackendVersion.commit && (
                          <KeyValue
                            label={t('in-components:aboutInstanaDialog.labelCommit')}
                            value={uiBackendVersion.commit.substring(0, 12)}
                            accentuated
                          />
                        )
                      );
                    }
                  }
                ]}
              />
            </Li>
          )}

          <Li>
            <ColumnizedContent
              columnDefinitions={[
                {
                  width: '10rem',
                  getContent() {
                    return t('in-components:aboutInstanaDialog.geo.title');
                  }
                },
                {
                  getContent() {
                    return (
                      <span className={locals.maxMindAttribution}>
                        <Trans
                          i18nKey="in-components:aboutInstanaDialog.geo.description"
                          components={{
                            linkToMaxMind: <Link external href="https://www.maxmind.com" />
                          }}
                        />
                      </span>
                    );
                  }
                }
              ]}
            />
          </Li>
        </Ul>

        <Button
          kind="primaryv2"
          onClick={() => {
            goToPath(graphPath);
            close();
          }}
        >
          {t('in-components:aboutInstanaDialog.buttonGraphShowcase')}
        </Button>
      </Stack>
    </Dialog>
  );
}
