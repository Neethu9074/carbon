/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { fireEvent, render, screen, act } from '@testing-library/react';
import React from 'react';

import { create, Observable, Subject } from '@instana/observables';
import { IpMaskingConfiguration, Result } from '@instana/types';

import IpMasking from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/IpMasking';
import { loading, success } from 'in-services/util/result';

describe('in-websites/WebsiteDashboard/tabs/Configuration/Options/IpMasking', () => {
  let setObservable: Subject<Result<IpMaskingConfiguration>>;
  let set: jest.Mock<Observable<Result<IpMaskingConfiguration>>, [IpMaskingConfiguration]>;
  let getObservable: Subject<Result<IpMaskingConfiguration>>;
  let get: jest.Mock<Observable<Result<IpMaskingConfiguration>>, [void]>;

  beforeEach(() => {
    get = jest.fn();
    getObservable = create<Result<IpMaskingConfiguration>>().emit(loading);
    get.mockReturnValue(getObservable);
    set = jest.fn();
    setObservable = create<Result<IpMaskingConfiguration>>().emit(loading);
    set.mockReturnValue(setObservable);
  });

  it('must render loading state', () => {
    // When
    render(<IpMasking get={get} set={set} />);

    // Then
    const { select, button } = getElements();
    expect(select.disabled).toEqual(true);
    expect(select.value).toEqual('DEFAULT');
    expect(button.disabled).toEqual(true);
  });

  it('must switch to actionable state', () => {
    // Given
    render(<IpMasking get={get} set={set} />);

    // When
    act(() => {
      getObservable.emit(
        success({
          ipMasking: 'STRICT'
        })
      );
    });

    // Then
    const { select, button } = getElements();
    expect(select.disabled).toEqual(false);
    expect(select.value).toEqual('STRICT');
    expect(button.disabled).toEqual(false);
  });

  it('must trigger a save action', () => {
    // Given
    getObservable.emit(
      success({
        ipMasking: 'STRICT'
      })
    );
    render(<IpMasking get={get} set={set} />);

    // When
    const { select, button } = getElements();
    fireEvent.change(select, { target: { value: 'REMOVE_ALL_DETAILS' } });
    fireEvent.submit(select);

    // Then
    expect(select.disabled).toEqual(true);
    expect(select.value).toEqual('REMOVE_ALL_DETAILS');
    expect(button.disabled).toEqual(true);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({
      ipMasking: 'REMOVE_ALL_DETAILS'
    });
  });

  it('must show success indication once finished', () => {
    // Given
    getObservable.emit(
      success({
        ipMasking: 'STRICT'
      })
    );
    render(<IpMasking get={get} set={set} />);
    const { select, button } = getElements();
    fireEvent.change(select, { target: { value: 'REMOVE_ALL_DETAILS' } });
    fireEvent.submit(select);

    // When
    act(() => {
      setObservable.emit(
        success({
          ipMasking: 'REMOVE_ALL_DETAILS'
        })
      );
    });

    // Then
    expect(select.disabled).toEqual(false);
    expect(select.value).toEqual('REMOVE_ALL_DETAILS');
    expect(button.disabled).toEqual(false);
    screen.getByText('Saved');
  });
});

interface Elements {
  select: HTMLSelectElement;
  button: HTMLButtonElement;
}

function getElements(): Elements {
  return {
    select: screen.getByRole('combobox'),
    button: screen.getByRole('button')
  };
}
