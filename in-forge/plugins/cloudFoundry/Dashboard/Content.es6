import React from 'react';

import {
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';

import ApplicationsTable from 'in-forge/plugins/cloudFoundry/Dashboard/ApplicationsTable';

const noDataDecimalFormatter = d => d < 0 ? 'No data' : zeroDecimalPlaces(d);
const noDataPercentageFormatter = d => d < 0 ?
  'No data' : percentageTwoDecimalPlaces(d);
const noDataBytesFormatter = d => d < 0 ? 'No data' : bytesZeroDecimalPlaces(d);

export default function CloudFoundryDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <ApplicationsTable snapshot={snapshot}
                         timeframe={timeframe} />

      <TwoColumnRow>
        <DashboardSection title='Doppler - statistics'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'doppler.error_received',
                     'doppler.total_dropped_msg'
                   ],
                   labels: [
                     'Error received',
                     'Dropped messages'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>

        <DashboardSection title='Doppler - memory'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataBytesFormatter,
                   tooltipFormatter: noDataBytesFormatter,
                   metrics: [
                     'doppler.bytes_allocated',
                     'doppler.bytes_allocated_heap',
                     'doppler.bytes_allocated_stack',
                   ],
                   labels: [
                     'Allocated',
                     'Allocated Heap',
                     'Allocated Stack'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Diego - auctioneer - routines'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'diego.auctioneer_num_go_routines'
                   ],
                   labels: [
                     'Go routines'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>

        <DashboardSection title='Diego - auctioneer - memory'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataBytesFormatter,
                   tooltipFormatter: noDataBytesFormatter,
                   metrics: [
                     'diego.auctioneer_bytes_allocated',
                     'diego.auctioneer_bytes_allocated_heap',
                     'diego.auctioneer_bytes_allocated_stack',
                   ],
                   labels: [
                     'Allocated',
                     'Allocated Heap',
                     'Allocated Stack'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Diego - stager - routines'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'diego.stager_num_go_routines'
                   ],
                   labels: [
                     'Go routines'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>

        <DashboardSection title='Diego - stager - memory'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataBytesFormatter,
                   tooltipFormatter: noDataBytesFormatter,
                   metrics: [
                     'diego.stager_bytes_allocated',
                     'diego.stager_bytes_allocated_heap',
                     'diego.stager_bytes_allocated_stack',
                   ],
                   labels: [
                     'Allocated',
                     'Allocated Heap',
                     'Allocated Stack'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Diego - fileserver - routines'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'diego.fs_num_go_routines'
                   ],
                   labels: [
                     'Go routines'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>

        <DashboardSection title='Diego - fileserver - memory'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataBytesFormatter,
                   tooltipFormatter: noDataBytesFormatter,
                   metrics: [
                     'diego.fs_bytes_allocated',
                     'diego.fs_bytes_allocated_heap',
                     'diego.fs_bytes_allocated_stack',
                   ],
                   labels: [
                     'Allocated',
                     'Allocated Heap',
                     'Allocated Stack'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <DashboardSection title='Diego - stager - requests'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={timeframe}
               margins={{
                 left: 60
               }}
               y1={{
                 formatter: noDataBytesFormatter,
                 tooltipFormatter: noDataBytesFormatter,
                 metrics: [
                   'diego.stager_staging_req_failed',
                   'diego.stager_staging_req_succeeded'
                 ],
                 labels: [
                   'Requests failed',
                   'Requests succeeded'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <TwoColumnRow>
        <DashboardSection title='DEA - resources'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataPercentageFormatter,
                   tooltipFormatter: noDataPercentageFormatter,
                   metrics: [
                     'dea.dea_available_disk_ratio',
                     'dea.dea_available_memory_ratio',
                   ],
                   labels: [
                     'Available disk ratio',
                     'Available memory ratio'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>

        <DashboardSection title='DEA - registry'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'dea.dea_registry_born',
                     'dea.dea_registry_crashed',
                     'dea.dea_registry_evacuating',
                     'dea.dea_registry_running',
                     'dea.dea_registry_starting',
                     'dea.dea_registry_stopped'
                   ],
                   labels: [
                     'Born',
                     'Crashed',
                     'Evacuating',
                     'Running',
                     'Starting',
                     'Stopped'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Cloud Controller - requests'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'cloud_controller.cc_requests_completed',
                     'cloud_controller.cc_requests_outstanding',
                   ],
                   labels: [
                     'Requests completed',
                     'Requests outstanding'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>

        <DashboardSection title='Cloud Controller - statistics'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'cloud_controller.cc_total_users',
                     'cloud_controller.cc_thread_count',
                     'cloud_controller.cc_total_failed_job_count'
                   ],
                   labels: [
                     'Total users',
                     'Thread count',
                     'Total failed jobs'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title='Health Manager API - statistics'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataDecimalFormatter,
                   tooltipFormatter: noDataDecimalFormatter,
                   metrics: [
                     'hm.hm_api_num_go_routines'
                   ],
                   labels: [
                     'Go routines'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>

        <DashboardSection title='Health Manager API - memory'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   formatter: noDataBytesFormatter,
                   tooltipFormatter: noDataBytesFormatter,
                   metrics: [
                     'hm.hm_api_bytes_allocated',
                     'hm.hm_api_bytes_allocated_heap',
                     'hm.hm_api_bytes_allocated_stack',
                   ],
                   labels: [
                     'Allocated',
                     'Allocated Heap',
                     'Allocated Stack'
                   ],
                   type: 'line'
                 }} />
        </DashboardSection>
      </TwoColumnRow>
      <DashboardSection title='Health Manager Analyzer'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={timeframe}
               margins={{
                 left: 60
               }}
               y1={{
                 formatter: noDataDecimalFormatter,
                 tooltipFormatter: noDataDecimalFormatter,
                 metrics: [
                   'hm.hm_analyzer_num_crashed_indices',
                   'hm.hm_analyzer_num_crashed_instances',
                   'hm.hm_analyzer_num_missing_indices',
                   'hm.hm_analyzer_num_running_instances',
                 ],
                 labels: [
                   'Crashed indices',
                   'Crashed instances',
                   'Missing indices',
                   'Running instances'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>

    </div>
  );
}
