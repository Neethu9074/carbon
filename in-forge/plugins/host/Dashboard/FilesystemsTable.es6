import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {isWindows} from 'in-forge/plugins/host/hostUtils';
import {emptyList} from 'in-services/fixedImmutables';
import HelpLink from 'in-components/HelpLink';
import {getMaxValue} from 'in-sdk/metrics';
import {
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces,
  withSiMultiplyPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function FilesystemsTable({snapshot, timeframe}) {
  const filesystems = snapshot.getIn(['data', 'filesystems'], emptyList);

  return (
    <DashboardSection title='Filesystems'>
      <ExpandableTable data={filesystems}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
}


function getKey(filesystem, name) {
  return name;
}


function createHeader(context) {
  return (
    <thead>
      <tr>
        <th>Device</th>
        {!isWindows(context.snapshot) ? <th>Mount</th> : null}
        <th>Options</th>
        <th>Type</th>
        <th>Capacity</th>
        <th>Free</th>
        <th>
          <HelpLink helpId='leakedDiskSpace'>
            Leaked
          </HelpLink>
        </th>
        {!isWindows(context.snapshot) ? <th>iFree</th> : null}
      </tr>
    </thead>
  );
}


function createRow(filesystem, name, context) {
  const isWindowsSnapshot = isWindows(context.snapshot);
  const mount = !isWindowsSnapshot
    ? <td>{filesystem.get('mount')}</td>
    : null;

  let ifree = null;
  if (!isWindowsSnapshot) {
    ifree = filesystem.get('icapacity')
      ? <Mtd metric={'fs.' + name + '.ifree'}
           snapshot={context.snapshot}
           formatter={withSiMultiplyPrefixZeroDecimalPlaces} />
      : <td>N/A</td>;
  }


  return ([
    <td>{name}</td>,

    mount,

    <td>{filesystem.get('options')}</td>,

    <td>{filesystem.get('systype')}</td>,

    <td>{kiloBytesTwoDecimalPlaces(filesystem.get('capacity'))}</td>,

    <Mtd metric={'fs.' + name + '.free'}
         snapshot={context.snapshot}
         formatter={kiloBytesTwoDecimalPlaces} />,

    <Mtd metric={'fs.' + name + '.leaked'}
         snapshot={context.snapshot}
         formatter={kiloBytesTwoDecimalPlaces} />,

    ifree
  ]);
}


function createDetails(filesystem, name, context) {
  return (
    <div>
      {isWindows(context.snapshot) || !filesystem.get('icapacity') ?
        <ChartWithLegend snapshotId={context.snapshot.get('id')}
                         timeframe={context.timeframe}
                         margins={{
                           left: 80,
                           right: 80
                         }}

                         y1={{
                           min: 0,
                           max: getMaxValue(
                             'fs.' + name + '.free',
                             context.snapshot
                           ),
                           formatter: kiloBytesZeroDecimalPlaces,
                           tooltipFormatter: kiloBytesTwoDecimalPlaces,
                           metrics: [
                             'fs.' + name + '.free',
                             'fs.' + name + '.leaked'
                           ],
                           labels: ['Free', 'Leaked'],
                           type: 'line'
                         }}/>

        :

        <ChartWithLegend snapshotId={context.snapshot.get('id')}
                         timeframe={context.timeframe}
                         margins={{
                           left: 80,
                           right: 80
                         }}

                         y1={{
                           min: 0,
                           max: getMaxValue(
                             'fs.' + name + '.free',
                             context.snapshot
                           ),
                           formatter: kiloBytesZeroDecimalPlaces,
                           tooltipFormatter: kiloBytesTwoDecimalPlaces,
                           metrics: [
                             'fs.' + name + '.free',
                             'fs.' + name + '.leaked'
                           ],
                           labels: ['Free', 'Leaked'],
                           type: 'line'
                         }}

                         y2={{
                           min: 0,
                           max: getMaxValue(
                             'fs.' + name + '.ifree',
                             context.snapshot
                           ),
                           metrics: [
                             'fs.' + name + '.ifree'
                           ],
                           labels: ['iFree'],
                           type: 'line',
                           formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                           tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces
                         }}/>
        }

        <ChartWithLegend snapshotId={context.snapshot.get('id')}
               timeframe={context.timeframe}
               margins={{
                 left: 80,
                 right: 80
               }}

               y1={{
                 min: 0,
                 formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                 tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
                 metrics: [
                   'fs.' + name + '.reads',
                   'fs.' + name + '.writes'
                 ],
                 labels: ['Reads/s', 'Writes/s'],
                 type: 'line'
               }}

               y2={{
                 min: 0,
                 formatter: kiloBytesZeroDecimalPlaces,
                 tooltipFormatter: kiloBytesTwoDecimalPlaces,
                 metrics: [
                   'fs.' + name + '.readBytes',
                   'fs.' + name + '.writeBytes'
                 ],
                 labels: ['Bytes Read/s', 'Bytes Write/s'],
                 type: 'line'
               }}/>
      </div>
  );
}
