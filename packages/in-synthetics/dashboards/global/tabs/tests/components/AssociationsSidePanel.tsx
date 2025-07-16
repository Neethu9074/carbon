/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  DataTable,
  Layer,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@instana/carbon';
import { NoDataEmptyState, SidePanel } from '@instana/ibm-products';
import { generateUniqueShortId } from '@instana/utils';

// @ts-expect-error needs migration to TS
import MobileHealthIndicatorBehavior from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileHealthIndicatorBehavior';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityHealthIndicatorBehavior';
// @ts-expect-error needs migration to TS
import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior';
import { constructAssociationsMap } from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContentPresenter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
import { AssociationsSidePanelProps, JsxRow, TabProps } from 'in-synthetics/utils/constants';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import { useGenerateLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { useGenerateLinkToWebsite } from 'in-websites/navigation/paths';
import { Row } from 'in-synthetics/components/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

const EntityRow = ({ row, tab }: { row: Row; tab: TabProps }) => {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToWebsiteDashboard = useGenerateLinkToWebsite();
  const getLinkToMobileAppDashboard = useGenerateLinkToMobileApp();
  const getRedirectionLink = (key: string, id: string) => {
    switch (key) {
      case 'websites': {
        const websiteId = id;
        return getLinkToWebsiteDashboard(websiteId);
      }
      case 'mobileApps': {
        const mobileAppId = id;
        return getLinkToMobileAppDashboard(mobileAppId);
      }
      default:
        return getLinkToApplicationDashboard({ applicationId: id });
    }
  };
  return (
    <>
      {row.cells.map(cell => {
        const id = tab.map?.get(cell.value);
        const href = getRedirectionLink(tab.key, id);
        return (
          <TableCell key={cell.id}>
            {tab.idsCanBeLinked.includes(id) ? (
              <Link inline href={href} title={cell.value}>
                <span className={locals.label}>
                  {typeof cell.value === 'string' && cell.value.length > 30
                    ? cell.value.slice(0, 30) + '...'
                    : cell.value}
                </span>
              </Link>
            ) : (
              <span className={locals.label}>{cell.value}</span>
            )}
          </TableCell>
        );
      })}
    </>
  );
};

export function AssociationsSidePanel({
  associationsColumnText,
  applicationLabels,
  websiteLabels,
  mobileAppLabels,
  applicationIds,
  websiteIds,
  mobileAppIds,
  applicationIdsCanBeLinked,
  websiteIdsCanBeLinked,
  mobileAppIdsCanBeLinked,
  associationsSidePanelOpen,
  setAssociationsSidePanelOpen
}: AssociationsSidePanelProps) {
  const timeConfig = useTimeConfig();
  const headers = [
    { key: 'name', header: t('in-synthetics:dashboard.testList.associationsColumn.associationsNameHeader') },
    { key: 'health', header: t('in-synthetics:dashboard.testList.associationsColumn.associationsHealthHeader') }
  ];
  const numberOfAssociations: number = applicationLabels.length + websiteLabels.length + mobileAppLabels.length;

  const getHealthIndication = (key: string, id: string) => {
    switch (key) {
      case 'websites':
        return (
          <WebsiteHealthIndicatorBehavior
            IndicatorPresenter={HealthIndicatorPresenter}
            websiteId={id}
            timeConfig={timeConfig}
          />
        );
      case 'mobileApps':
        return (
          <MobileHealthIndicatorBehavior
            IndicatorPresenter={HealthIndicatorPresenter}
            mobileAppId={id}
            timeConfig={timeConfig}
          />
        );
      default:
        return (
          <ApplicationEntityHealthIndicatorBehavior
            IndicatorPresenter={HealthIndicatorPresenter}
            applicationId={id}
            timeConfig={timeConfig}
          />
        );
    }
  };

  const constructAssociationsHealthMap = (associationIds: string[], context: string) => {
    const map = new Map<string, JSX.Element>();
    for (const associationId of associationIds) {
      map.set(associationId, getHealthIndication(context, associationId));
    }
    return map;
  };

  const associationTabs = [
    {
      key: 'applications',
      label: t('in-synthetics:dashboard.testList.multiAppDialog.filterLabel'),
      secondaryLabel: applicationLabels.length,
      labels: applicationLabels,
      idsCanBeLinked: applicationIdsCanBeLinked,
      map: constructAssociationsMap(applicationLabels, applicationIds),
      healthMap: constructAssociationsHealthMap(applicationIds, 'applications')
    },
    {
      key: 'websites',
      label: t('in-synthetics:dashboard.testList.multiWebDialog.filterLabel'),
      secondaryLabel: websiteLabels.length,
      labels: websiteLabels,
      idsCanBeLinked: websiteIdsCanBeLinked,
      map: constructAssociationsMap(websiteLabels, websiteIds),
      healthMap: constructAssociationsHealthMap(websiteIds, 'websites')
    },
    {
      key: 'mobileApps',
      label: t('in-synthetics:dashboard.testList.multiMobileDialog.filterLabel'),
      secondaryLabel: mobileAppLabels.length,
      labels: mobileAppLabels,
      idsCanBeLinked: mobileAppIdsCanBeLinked,
      map: constructAssociationsMap(mobileAppLabels, mobileAppIds),
      healthMap: constructAssociationsHealthMap(mobileAppIds, 'mobileApps')
    }
  ];

  const generateRows = (
    labels: string[],
    map: Map<string, string> | null,
    healthMap: Map<string, JSX.Element>
  ): JsxRow[] =>
    labels.map(label => ({
      id: generateUniqueShortId(),
      name: label ?? '',
      health: healthMap?.get(map?.get(label) ?? '') ?? ''
    }));

  const getNoDataTitle = (key: string) => {
    switch (key) {
      case 'websites':
        return t('in-synthetics:dashboard.testList.multiWebDialog.noWebsiteAssociatedWithTest');
      case 'mobileApps':
        return t('in-synthetics:dashboard.testList.multiMobileDialog.nodMobileAppAssociatedWithTest');
      default:
        return t('in-synthetics:dashboard.testList.multiAppDialog.noApplicationAssociatedWithTest');
    }
  };

  const renderTable = (rows: JsxRow[], tab: TabProps) => (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map(row => (
                <TableRow {...getRowProps({ row })}>
                  <EntityRow row={row} tab={tab} />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length}>
                  <NoDataEmptyState title={getNoDataTitle(tab.key)} className={locals.noDataTile} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );

  if (numberOfAssociations !== 0) {
    return (
      <>
        <SidePanel
          open={associationsSidePanelOpen}
          size="md"
          includeOverlay
          onRequestClose={() => setAssociationsSidePanelOpen(false)}
          title={t('in-synthetics:dashboard.testList.associationsColumn.associationsSidePanelTitle', {
            totalAssociations: applicationLabels.length + websiteLabels.length + mobileAppLabels.length
          })}
          animateTitle={false}
          className={locals.associationsSidePanel}
        >
          <Layer>
            <Tabs>
              <TabList contained aria-label="Associations">
                {associationTabs.map(tab => (
                  <Tab key={tab.key} secondaryLabel={tab.secondaryLabel.toString()}>
                    {tab.label}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {associationTabs.map(tab => (
                  <TabPanel key={tab.key}>
                    {renderTable(generateRows(tab.labels, tab.map, tab.healthMap), tab)}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Layer>
        </SidePanel>

        <Link onClick={() => setAssociationsSidePanelOpen(true)}>
          <span data-test="locations-col-text" className={locals.labelApp}>
            {associationsColumnText}
          </span>
        </Link>
      </>
    );
  }
  return <span data-testid="noAssociations">{''}</span>;
}
