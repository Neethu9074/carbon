/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonDataTable,
  CarbonModal,
  CarbonStack,
  CarbonTable,
  CarbonTableBody,
  CarbonTableCell,
  CarbonTableContainer,
  CarbonTableHead,
  CarbonTableHeader,
  CarbonTableRow,
  CarbonTableSelectAll,
  CarbonTableSelectRow,
  CarbonTableToolbar,
  CarbonTableToolbarContent,
  CarbonTableToolbarSearch,
  Pagination,
  Typography
} from '@instana/components';
import { UserResult } from '@instana/types';

import { createSelectUserForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/components/SelectUserDialog.form';
import MapFormProvider, { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import useDerivedState from 'in-hooks/useDerivedState';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { t } from 'in-i18n';

const SELECT_USER_FORM_ID = 'select-user-form';
const PAGE_SIZE = 7;

function filterUsersByQuery(users: Array<UserResult>, query: string): Array<UserResult> {
  const lowerCaseQuery = query.toLowerCase();
  return users.filter(({ fullName, email }) => {
    const lowerCaseName = fullName.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();
    return lowerCaseName.match(lowerCaseQuery) || lowerCaseEmail.match(lowerCaseQuery);
  });
}

function paginateUsers(users: Array<UserResult>, page: number, pageSize: number): Array<UserResult> {
  const pageIndex = page - 1;
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  return users.slice(startIndex, endIndex);
}

function removeUserId(userIds: string[], userId: string): string[] {
  return userIds.filter(uid => uid !== userId);
}

function addUserId(userIds: string[], userId: string): string[] {
  return [...userIds, userId];
}

interface SelectUserDialogProps extends Pick<Parameters<typeof CarbonModal>[0], 'modalHeading'> {
  onCancel: VoidFunction;
  onConfirm: (userIds: string[]) => void;
  preselectedIds: string[];
  tableTitle?: string;
  users: Array<UserResult>;
}

export default function SelectUserDialog({
  modalHeading,
  onCancel,
  onConfirm,
  preselectedIds,
  tableTitle,
  users
}: SelectUserDialogProps) {
  const [form, setForm] = useDerivedState(createSelectUserForm(preselectedIds));
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);

  const filteredUsers = filterUsersByQuery(users, query);
  const paginatedUsers = paginateUsers(filteredUsers, page, pageSize);
  const selectedIds = form.get('userIds').value;

  return (
    <MapFormProvider id={SELECT_USER_FORM_ID} form={form} mode={FORM_MODE.EDIT} updateForm={setForm}>
      <CarbonModal
        modalHeading={modalHeading}
        onRequestClose={onCancel}
        onRequestSubmit={() => onConfirm(selectedIds)}
        onSecondarySubmit={onCancel}
        open
        primaryButtonText={t('in-settings:tabs.save')}
        secondaryButtonText={t('in-settings:tabs.cancel')}
        size="md"
      >
        <form>
          <CarbonDataTable
            headers={[
              {
                header: t('in-settings:components.userNameColumnHead'),
                key: 'fullName'
              }
            ]}
            rows={paginatedUsers}
          >
            {({
              getHeaderProps,
              getRowProps,
              getSelectionProps,
              getTableContainerProps,
              getTableProps,
              getToolbarProps,
              headers,
              rows
            }) => (
              <CarbonTableContainer title={tableTitle} {...getTableContainerProps()}>
                <CarbonTableToolbar {...getToolbarProps()}>
                  <CarbonTableToolbarContent>
                    <CarbonTableToolbarSearch
                      onChange={e => (typeof e !== 'string' ? setQuery(e.target.value) : setQuery(e))}
                    />
                  </CarbonTableToolbarContent>
                </CarbonTableToolbar>
                <CarbonTable {...getTableProps()}>
                  <CarbonTableHead>
                    <CarbonTableRow>
                      <CarbonTableSelectAll {...getSelectionProps()} />
                      {headers.map(header => (
                        <CarbonTableHeader {...getHeaderProps({ header })}>{header.header}</CarbonTableHeader>
                      ))}
                    </CarbonTableRow>
                  </CarbonTableHead>
                  <CarbonTableBody>
                    {rows.map(row => (
                      <CarbonTableRow {...getRowProps({ row })}>
                        <CarbonTableSelectRow
                          {...getSelectionProps({ row })}
                          checked={selectedIds.includes(row.id)}
                          onChange={checked => {
                            const newUserIds = checked
                              ? addUserId(selectedIds, row.id)
                              : removeUserId(selectedIds, row.id);
                            setForm(
                              form.updateIn(['userIds'], () =>
                                form.get('userIds').setValue(newUserIds).setTouched(true)
                              )
                            );
                          }}
                        />
                        {row.cells.map(cell => (
                          <CarbonTableCell key={cell.id}>
                            <CarbonStack as="span" orientation="horizontal" gap="var(--cds-spacing-03)">
                              <UserIcon color="var(--cds-background-inverse)" size="regular" type="lib_menu_account" />
                              <Typography variant="body-large" noWrap>
                                {cell.value}
                              </Typography>
                            </CarbonStack>
                          </CarbonTableCell>
                        ))}
                      </CarbonTableRow>
                    ))}
                  </CarbonTableBody>
                </CarbonTable>
              </CarbonTableContainer>
            )}
          </CarbonDataTable>
          {paginatedUsers?.length > 0 && (
            <Pagination
              pageSizes={[PAGE_SIZE, 20, 50, 100]}
              totalItems={filteredUsers.length}
              page={page}
              pageSize={pageSize}
              onChange={data => {
                setPage(data.page);
                setPageSize(data.pageSize);
              }}
            />
          )}
        </form>
      </CarbonModal>
    </MapFormProvider>
  );
}
