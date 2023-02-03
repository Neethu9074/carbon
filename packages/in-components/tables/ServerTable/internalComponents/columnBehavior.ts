/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { noop } from 'in-services/util/function';

type OnColumnChange = (p: { disabledColumns?: string[]; enabledColumns?: string[] }) => void;

interface FilterColumnsProps<ColumnDefinitionType extends ColumnDefinition<any>> {
  columnDefinitions: ColumnDefinitionType[];
  filterColumnDefinitions?: (
    props: FilterColumnsProps<ColumnDefinitionType>
  ) => (definition: ColumnDefinitionType) => boolean;
  optionalColumns?: string[];
  disabledColumns?: string[];
  enabledColumns?: string[];
  onChange?: OnColumnChange;
}

interface FilteredColumns<ColumnDefinitionType extends ColumnDefinition<any>> {
  availableColumns: ColumnDefinitionType[];
  visibleColumns: ColumnDefinitionType[];
  optionalColumns?: string[];
  onColumnChecked: (columnId: string, checked: boolean) => void;
}

export function filterColumns<ColumnDefinitionType extends ColumnDefinition<any>>(
  props: FilterColumnsProps<ColumnDefinitionType>
): FilteredColumns<ColumnDefinitionType> {
  const {
    columnDefinitions,
    filterColumnDefinitions = () => () => true,
    optionalColumns,
    disabledColumns = [],
    enabledColumns = [],
    onChange
  } = props;
  const availableColumns = columnDefinitions.filter(filterColumnDefinitions(props));

  let visibleColumns = availableColumns;
  const containsOptionalColumns = optionalColumns && optionalColumns.length > 0;
  if (containsOptionalColumns) {
    visibleColumns = availableColumns.filter(
      def => disabledColumns.indexOf(def.id) === -1 && (!def.defaultDisabled || enabledColumns.indexOf(def.id) >= 0)
    );
  }

  return {
    availableColumns,
    visibleColumns,
    optionalColumns,
    onColumnChecked: (columnId, checked) =>
      onColumnChecked(onChange ?? noop, disabledColumns, enabledColumns, columnId, checked)
  };
}

function onColumnChecked(
  onChange: OnColumnChange,
  disabledColumns: string[],
  enabledColumns: string[],
  columnId: string,
  checked: boolean
): void {
  const disabledIdx = disabledColumns.indexOf(columnId);
  const enabledIdx = enabledColumns.indexOf(columnId);
  if (checked) {
    if (disabledIdx >= 0) {
      onChange({ disabledColumns: disabledColumns.filter(c => c !== columnId) });
    } else {
      onChange({ enabledColumns: [...enabledColumns, columnId] });
    }
  } else {
    if (enabledIdx >= 0) {
      onChange({ enabledColumns: enabledColumns.filter(c => c !== columnId) });
    } else {
      onChange({ disabledColumns: [...disabledColumns, columnId] });
    }
  }
}
