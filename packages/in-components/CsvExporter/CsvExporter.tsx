/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';

// this was imported from rxjs by accident probably since fetchData returns @instana/observables/Observable in every use case
import { Observable } from '@instana/observables';
import { Button } from '@instana/components';
import { Cursor } from '@instana/types';

import { t } from 'in-i18n';

import locals from './CsvExporter.mless';

export interface CsvExporterProps {
  data?: Data;
  fetchData?: (cursor: Cursor) => Observable<any>;
  headers: Array<string> | undefined;
  fileName?: string;
  processData?: (d: object[], c: object[]) => Data;
  asyncOnClick?: boolean | undefined;
  cursor?: Cursor;
  columns?: object[];
}

export interface LoadingProps {
  loading: boolean;
}

type Data = object[];

export default function CsvExporter({
  data,
  headers,
  fileName = 'data.csv',
  processData,
  fetchData,
  cursor,
  columns = [{}]
}: CsvExporterProps) {
  const [csvData, setCsvData]: any[] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const csvInstance = useRef<any | null>(null);
  const subscriptionRef = useRef<any | null>(null);

  const asyncExportMethod = () => {
    setIsDisable(true);

    if (fetchData !== undefined) {
      subscriptionRef.current = fetchData(cursor ?? { offset: 0 }).subscribe(res => {
        if (!res.progress.loading) {
          setCsvData(processData !== undefined ? processData(res?.data?.items, columns) : res?.data?.items);
          setIsDisable(false);
        }
      });
    }
  };

  useEffect(() => {
    if (csvData && csvInstance && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setCsvData([]);

        // Cancel subscription
        subscriptionRef.current?.dispose();
        subscriptionRef.current = null;
      });
    }
  }, [csvData]);

  let processedData: Data;

  if (data !== undefined) {
    processedData = processData !== undefined ? processData(data, columns) : data;
    return (
      <CSVLink
        style={{ textDecoration: 'none' }}
        data={processedData}
        headers={headers}
        filename={fileName}
        target="_blank"
      >
        <Button kind="secondary" target="_blank" className={locals.csvExporterButton} size="compact">
          {t('in-components:csvExporterButton.label')}
        </Button>
      </CSVLink>
    );
  } else {
    if (fetchData !== undefined) {
      return (
        <>
          <div
            onClick={() => {
              asyncExportMethod();
            }}
          >
            <Button
              iconSpinning={isDisable}
              icon={isDisable ? 'lib_actions_loading' : undefined}
              disabled={isDisable}
              kind="secondary"
              target="_blank"
              className={locals.csvExporterButton}
              size="compact"
            >
              {t('in-components:csvExporterButton.label')}
            </Button>
          </div>
          {csvData.length > 0 ? (
            <CSVLink
              data={csvData}
              headers={headers || Object.keys(csvData[0])}
              filename={fileName}
              ref={csvInstance}
              target="_blank"
            />
          ) : undefined}
        </>
      );
    }
    return <></>;
  }
}
