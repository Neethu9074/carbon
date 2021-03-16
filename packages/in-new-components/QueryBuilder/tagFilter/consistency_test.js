/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import * as operatorValueRequirement from 'in-new-components/QueryBuilder/tagFilter/operatorValueRequirement';
import * as typeToOperatorsMapping from 'in-new-components/QueryBuilder/tagFilter/typeToOperatorsMapping';
import * as operatorKeyRequirement from 'in-new-components/QueryBuilder/tagFilter/operatorKeyRequirement';
import * as operatorLabelsMapping from 'in-new-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import * as operators from 'in-new-components/QueryBuilder/tagFilter/operators';
import * as types from 'in-new-components/QueryBuilder/tagFilter/types';

describe('in-new-components/QueryBuilder/tagFilter/consistency', () => {
  getAllExportedNames(types).forEach(type => {
    describe(type, () => {
      it('must define operators', () => {
        expect(typeToOperatorsMapping).to.have.property(type);
      });

      it('must only use known operators', () => {
        typeToOperatorsMapping[type].forEach(operator => {
          expect(operators).to.have.property(operator);
        });
      });

      it('must define labels for each type/operator combination', () => {
        typeToOperatorsMapping[type].forEach(operator => {
          const combination = `${type}_${operator}`;
          expect(operatorLabelsMapping, `Must define label for '${combination}'`).to.have.property(combination);
        });
      });
    });
  });

  it('must only define key requirements for supported type/operator combinations', () => {
    getAllExportedNames(operatorKeyRequirement).forEach(combination => {
      expect(
        operatorLabelsMapping,
        `Key requirement defined for unknown combination '${combination}'.`
      ).to.have.property(combination);
    });
  });

  it('must only define value requirements for supported type/operator combinations', () => {
    getAllExportedNames(operatorValueRequirement).forEach(combination => {
      expect(
        operatorLabelsMapping,
        `Value requirement defined for unknown combination '${combination}'.`
      ).to.have.property(combination);
    });
  });
});

function getAllExportedNames(mod) {
  return Object.keys(mod).filter(k => k !== '__esModule');
}
