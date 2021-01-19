/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { close } from 'in-components/DialogPresenter/store';
import KeyValue from 'in-new-components/lists/KeyValue';
import Dialog from 'in-new-components/Dialog/Dialog';
import { instanaRegion } from 'in-services/config';
import Stack from 'in-new-components/layout/Stack';
import { goToPath } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import Button from 'in-new-components/Button';
import { build } from 'in-services/config';
import connectTo from 'in-hoc/connectTo';

import locals from './AboutInstanaDialog.mless';

export default connectTo(
  {
    uiBackendVersion: getUiBackendVersion()
  },
  function AboutInstanaDialog({ uiBackendVersion }) {
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
                        return 'Deployment';
                      }
                    },
                    {
                      width: '8rem',
                      getContent() {
                        return <KeyValue label="Region" value={instanaRegion} accentuated />;
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
                      return 'User Interface';
                    }
                  },
                  {
                    width: '8rem',
                    getContent() {
                      return build.tag && <KeyValue label="Tag" value={build.tag} accentuated />;
                    }
                  },
                  {
                    width: '8rem',
                    getContent() {
                      return (
                        build.revision && (
                          <KeyValue label="Commit" value={build.revision.substring(0, 12)} accentuated />
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
                        return 'Backend';
                      }
                    },
                    {
                      width: '8rem',
                      getContent() {
                        return (
                          uiBackendVersion.imageTag && (
                            <KeyValue label="Tag" value={uiBackendVersion.imageTag} accentuated />
                          )
                        );
                      }
                    },
                    {
                      width: '8rem',
                      getContent() {
                        return (
                          uiBackendVersion.commit && (
                            <KeyValue label="Commit" value={uiBackendVersion.commit.substring(0, 12)} accentuated />
                          )
                        );
                      }
                    }
                  ]}
                />
              </Li>
            )}
          </Ul>

          <Button
            kind="primaryv2"
            onClick={() => {
              goToPath(graphPath);
              close();
            }}
          >
            Graph Showcase
          </Button>
        </Stack>
      </Dialog>
    );
  }
);
