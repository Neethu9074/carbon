/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { Accordion, AccordionItem } from '@instana/carbon';
import { Card, Typography } from '@instana/components';
import { formatDateTime } from '@instana/format-date';
import { t } from '@instana/i18n-react';

import { parseIsmCustomMetrics } from 'in-synthetics/dashboards/details/utils';
import { syntheticSslImprovementEnabled } from 'in-services/featureFlags';
import { CopyButton } from 'in-synthetics/components/CopyButton';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/details/components/SSLCertificateDetails.mless';

interface Props {
  resultList: Result<PaginatedResult<TestResultListItem>>;
}

const SSLCertificateDetails = ({ resultList }: Props) => {
  const resultListItem = resultList.data?.items[0];
  if (syntheticSslImprovementEnabled) {
    const sslCustomMetrics = resultList.data?.items[0]?.testResultCommonProperties?.ismDetails ?? {};
    const requiredCustomMetrics = ['issuedTo', 'issuedBy', 'publicKeyInfo', 'fingerprints', 'tls'];

    //This map is used to populate correct label values for custom metrics
    const metricLabelMap = new Map([
      ['commonName', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.commonName')],
      ['alternativeName', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.alternativeName')],
      ['locality', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.locality')],
      ['organizationUnit', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.organizationUnit')],
      ['organization', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.organization')],
      ['state', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.state')],
      ['country', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.country')],
      ['standardName', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.standardName')],
      ['name', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.name')],
      ['version', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.version')],
      ['fingerprint', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.fingerprint')],
      ['fingerprint256', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.fingerprint256')],
      ['size', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.size')],
      ['modulus', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.modulus')],
      ['algorithm', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.algorithm')],
      ['exponent', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.exponent')],
      ['issuedTo', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.issuedTo')],
      ['issuedBy', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.issuedBy')],
      ['publicKeyInfo', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.publicKeyInfo')],
      ['fingerprints', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.fingerprints')],
      ['tls', t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.tls')]
    ]);

    //This map is used to display custom metrics in correct order
    const metricItemsMap = new Map([
      [
        'issuedTo',
        ['commonName', 'alternativeName', 'organization', 'organizationUnit', 'country', 'state', 'locality']
      ],
      [
        'issuedBy',
        ['commonName', 'alternativeName', 'organization', 'organizationUnit', 'country', 'state', 'locality']
      ],
      ['publicKeyInfo', ['algorithm', 'size', 'exponent', 'modulus']],
      ['fingerprints', ['fingerprint', 'fingerprint256']],
      ['tls', ['name', 'standardName', 'version']]
    ]);

    const itemsWithCopyOption = ['exponent', 'modulus', 'fingerprint', 'fingerprint256', 'name', 'standardName'];
    const itemsWithLink = ['commonName'];
    const populateMetricColumn = (metricKey: string, item: string, content: string) => {
      if (metricKey === 'issuedTo' && itemsWithLink.includes(item)) {
        const redirect = 'https://' + content;
        return (
          <Col>
            <a href={redirect} rel="noopener noreferrer" target="_blank">
              {content}
            </a>
          </Col>
        );
      } else if (item === 'modulus' || item === 'alternativeName') {
        return <Col className={locals.truncateText}>{content}</Col>;
      } else {
        return <Col>{content}</Col>;
      }
    };
    return (
      <Card title={t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.testDetails')}>
        <Accordion>
          <AccordionItem
            title={
              <Typography variant="heading-01">
                {t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.customMetrics')}
              </Typography>
            }
            open
          >
            <Row withoutTopMargin>
              <Col xs={2}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.valid')}</Col>
              <Col xs={6}>{sslCustomMetrics.valid}</Col>
            </Row>
            <Row withoutTopMargin>
              <Col xs={2}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.validFrom')}</Col>
              <Col xs={6}>
                {formatDateTime(get(resultListItem, ['metrics', 'synthetic.customMetrics.validFrom', 0, 1], 0))}
              </Col>
            </Row>
            <Row withoutTopMargin>
              <Col xs={2}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.validTo')}</Col>
              <Col xs={6}>
                {formatDateTime(get(resultListItem, ['metrics', 'synthetic.customMetrics.validTo', 0, 1], 0))}
              </Col>
            </Row>
            <Row withoutTopMargin>
              <Col xs={2}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.daysRemaining')}</Col>
              <Col xs={6}>{get(resultListItem, ['metrics', 'synthetic.customMetrics.daysRemaining', 0, 1], 0)}</Col>
            </Row>
          </AccordionItem>
          {requiredCustomMetrics.map(metricKey => {
            const metricValue = sslCustomMetrics[metricKey];
            const parsedMetricValue = requiredCustomMetrics.includes(metricKey)
              ? parseIsmCustomMetrics(metricValue)
              : undefined;
            return (
              parsedMetricValue &&
              parsedMetricValue.length > 0 &&
              metricItemsMap.get(metricKey) && (
                <AccordionItem title={<Typography variant="heading-01">{metricLabelMap.get(metricKey)}</Typography>}>
                  {metricItemsMap.get(metricKey)?.map((item, index) => {
                    return (
                      <Row key={'key-' + index} withoutTopMargin>
                        <Col xs={2}>{metricLabelMap.get(item)}</Col>
                        {parsedMetricValue[0][item] &&
                          populateMetricColumn(metricKey, item, parsedMetricValue[0][item])}
                        {(itemsWithCopyOption.includes(item) ||
                          (metricKey === 'issuedTo' && item === 'alternativeName')) &&
                          parsedMetricValue[0][item] && (
                            <Col>
                              <CopyButton className={locals.copyBtn} message={parsedMetricValue[0][item]} />
                            </Col>
                          )}
                      </Row>
                    );
                  })}
                </AccordionItem>
              )
            );
          })}
          <AccordionItem
            title={
              <Typography variant="heading-01">
                {t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.serialNumber')}
              </Typography>
            }
          >
            <Row withoutTopMargin>
              <Col xs={2}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.serialNumber')}</Col>
              <Col>{sslCustomMetrics.serialNumber}</Col>
              {sslCustomMetrics.serialNumber && (
                <Col>
                  <CopyButton className={locals.copyBtn} message={sslCustomMetrics.serialNumber} />
                </Col>
              )}
            </Row>
          </AccordionItem>

          <AccordionItem
            title={
              <Typography variant="heading-01">
                {t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.extKeyUsage')}
              </Typography>
            }
          >
            <Row withoutTopMargin>
              <Col xs={2}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.extKeyUsage')}</Col>
              {sslCustomMetrics.extKeyUsage && (
                <Col>
                  {sslCustomMetrics.extKeyUsage.includes('[')
                    ? sslCustomMetrics.extKeyUsage.slice(1, -1)
                    : sslCustomMetrics.extKeyUsage}
                </Col>
              )}
            </Row>
          </AccordionItem>
        </Accordion>
      </Card>
    );
  } else {
    return (
      <Card title={t('in-synthetics:dashboard.detailsPage.sslCertificate.customMetrics.titles.details')}>
        <Row>
          <Col xs={3}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.daysRemaining')}</Col>
          <Col xs={3}>{get(resultListItem, ['metrics', 'synthetic.customMetrics.daysRemaining', 0, 1], 0)}</Col>
        </Row>
        <Row>
          <Col xs={3}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.timeOfIssue')}</Col>
          <Col xs={3}>
            {formatDateTime(get(resultListItem, ['metrics', 'synthetic.customMetrics.validFrom', 0, 1], 0))}
          </Col>
        </Row>
        <Row>
          <Col xs={3}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.timeOfExpiry')}</Col>
          <Col xs={3}>
            {formatDateTime(get(resultListItem, ['metrics', 'synthetic.customMetrics.validTo', 0, 1], 0))}
          </Col>
        </Row>
      </Card>
    );
  }
};

export default SSLCertificateDetails;
