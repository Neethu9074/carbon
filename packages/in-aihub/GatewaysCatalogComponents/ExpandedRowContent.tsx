/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Typography } from '@instana/components';

import { Di, Dl } from 'in-components/HorizontalDescriptionList/HorizontalDescriptionList';
import type { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

import locals from './ExpandedRowContent.mless';

interface ExpandedRowContentProps {
  gateway: Gateway;
}

export default function ExpandedRowContent({ gateway }: ExpandedRowContentProps) {
  return (
    <>
      <Dl>
        <Di
          rowClassName={locals['expanded-row-padding']}
          title={<Typography variant="body-bold">{t('in-aihub:gateways.description')}</Typography>}
        >
          {gateway.description ?? valueMissingPlaceholder}
        </Di>

        {gateway.watsonxProject && (
          <Di
            rowClassName={locals['expanded-row-padding']}
            title={
              <Typography variant="body-bold">
                {' '}
                {t('in-aihub:gateways.createGateway.connectionSection.watsonxProject')}
              </Typography>
            }
          >
            {gateway.watsonxProject ?? valueMissingPlaceholder}
          </Di>
        )}
        {gateway.watsonxUrl !== '' && (
          <Di
            rowClassName={locals['expanded-row-padding']}
            title={
              <Typography variant="body-bold">
                {' '}
                {t('in-aihub:gateways.createGateway.connectionSection.watsonxUrl')}
              </Typography>
            }
          >
            {gateway.watsonxUrl}
          </Di>
        )}
        {gateway.endpointUrl !== '' && (
          <Di
            rowClassName={locals['expanded-row-padding']}
            title={
              <Typography variant="body-bold">
                {t('in-aihub:gateways.createGateway.connectionSection.endpointUrl')}
              </Typography>
            }
          >
            {gateway.endpointUrl}
          </Di>
        )}

        {/* Model Configuration Section */}
        {gateway.configurations && (
          <>
            {gateway.configurations.tokenLimit && (
              <Di
                rowClassName={locals['expanded-row-padding']}
                title={
                  <Typography variant="body-bold">
                    {t('in-aihub:gateways.createGateway.modelConfiguration.tokenLimit')}
                  </Typography>
                }
              >
                {gateway.configurations.tokenLimit}
              </Di>
            )}

            {gateway.configurations.maxLatency && (
              <Di
                rowClassName={locals['expanded-row-padding']}
                title={
                  <Typography variant="body-bold">
                    {t('in-aihub:gateways.createGateway.modelConfiguration.maxLatency')}
                  </Typography>
                }
              >
                {gateway.configurations.maxLatency}
              </Di>
            )}

            {gateway.configurations.repetitionPenalty && (
              <Di
                rowClassName={locals['expanded-row-padding']}
                title={
                  <Typography variant="body-bold">
                    {t('in-aihub:gateways.createGateway.modelConfiguration.repetitionPenalty')}
                  </Typography>
                }
              >
                {gateway.configurations.repetitionPenalty}
              </Di>
            )}

            {gateway.configurations.temperature && (
              <Di
                rowClassName={locals['expanded-row-padding']}
                title={
                  <Typography variant="body-bold">
                    {t('in-aihub:gateways.createGateway.modelConfiguration.temperature')}
                  </Typography>
                }
              >
                {gateway.configurations.temperature}
              </Di>
            )}

            {gateway.configurations.topK && (
              <Di
                rowClassName={locals['expanded-row-padding']}
                title={
                  <Typography variant="body-bold">
                    {t('in-aihub:gateways.createGateway.modelConfiguration.topK')}
                  </Typography>
                }
              >
                {gateway.configurations.topK}
              </Di>
            )}

            {gateway.configurations.topP && (
              <Di
                rowClassName={locals['expanded-row-padding']}
                title={
                  <Typography variant="body-bold">
                    {t('in-aihub:gateways.createGateway.modelConfiguration.topP')}
                  </Typography>
                }
              >
                {gateway.configurations.topP}
              </Di>
            )}
          </>
        )}
      </Dl>
    </>
  );
}
