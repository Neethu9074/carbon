/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { carbonSortHandler } from 'in-components/tables/ServerTable/carbonSortHandler';
import { CarbonHeader } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { TableProps } from 'in-components/tables/ServerTable/types';

interface DummyDataType {}

interface DummyTableProps extends TableProps<DummyDataType> {}

describe('carbonSortHandler', () => {
  const query = '';
  const pageSize = 10;
  const pageSizes = [10, 20, 50];

  const carbonHeaders: CarbonHeader<DummyDataType, DummyTableProps>[] = [
    {
      key: 'name',
      defaultOrderDirection: 'ASC',
      header: 'dummyHeader',
      getContent() {
        return 'dummyContent';
      }
    }
  ];

  it('should return a function', () => {
    const carbonHeaders: CarbonHeader<DummyDataType, DummyTableProps>[] = [];
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    expect(typeof result).toBe('function');
  });

  it('should call onChange with the correct parameters when sorting by a column ASC', () => {
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    result({ sortHeaderKey: 'name', sortDirection: 'ASC' });
    expect(onChange).toHaveBeenCalledWith({
      query,
      orderBy: 'name',
      orderDirection: 'DESC',
      page: 1,
      pageSize,
      pageSizes
    });
  });
  it('should call onChange with the correct parameters when sorting by an unknown column with no direction / NONE', () => {
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    result({ sortHeaderKey: 'unknown', sortDirection: 'NONE' });
    expect(onChange).toHaveBeenCalledWith({
      query,
      orderBy: 'unknown',
      orderDirection: 'ASC',
      page: 1,
      pageSize,
      pageSizes
    });
  });

  it('should call onChange with the correct parameters when sorting by an unknown column with unknown direction', () => {
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    result({ sortHeaderKey: 'unknown', sortDirection: 'unknown' });
    expect(onChange).toHaveBeenCalledWith({
      query,
      orderBy: 'unknown',
      orderDirection: 'ASC',
      page: 1,
      pageSize,
      pageSizes
    });
  });

  it('should call onChange with the correct parameters when sorting by a column DESC', () => {
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    result({ sortHeaderKey: 'name', sortDirection: 'DESC' });
    expect(onChange).toHaveBeenCalledWith({
      query,
      orderBy: 'name',
      orderDirection: 'ASC',
      page: 1,
      pageSize,
      pageSizes
    });
  });
  it('should call onChange with the correct parameters when sorting by a column NONE', () => {
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    result({ sortHeaderKey: 'name', sortDirection: 'NONE' });
    expect(onChange).toHaveBeenCalledWith({
      query,
      orderBy: 'name',
      orderDirection: 'ASC',
      page: 1,
      pageSize,
      pageSizes
    });
  });

  it('should call onChange with the correct parameters when switching column', () => {
    const onChange = jest.fn();
    const result = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);
    result({ sortHeaderKey: 'name', sortDirection: 'ASC' });
    result({ sortHeaderKey: 'age', sortDirection: 'NONE' });
    expect(onChange).toHaveBeenCalledWith({
      query,
      orderBy: 'age',
      orderDirection: 'ASC',
      page: 1,
      pageSize,
      pageSizes
    });
  });
});
