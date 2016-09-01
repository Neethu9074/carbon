/* eslint-env mocha */

import {expect} from 'chai';

import {formatSql, shortenSqlStatement} from 'in-forge/tracing/jdbc/sql';

describe('in-forge/tracing/jdbc/sql', () => {
  describe('formatSql', () => {
    describe('select statements', () => {
      it('must format simple select statements', () => {
        expect(formatSql('SELECT name from person')).to.equal('SELECT name\nFROM person');
      });

      it('must format statements with outer joins', () => {
        expect(formatSql('SELECT name from person outer join blub'))
          .to.equal('SELECT name\nFROM person\nOUTER JOIN blub');
      });
    });
  });

  describe('shortenSqlStatement', () => {
    describe('select statements', () => {
      it('must retain ORM comments', () => {
          expect(shortenSqlStatement(' /* MyAwesomeDao */ select id from product'))
            .to.equal('/* MyAwesomeDao */ SELECT … FROM product');
      });

      it('must not add excess ellipsis', () => {
        expect(shortenSqlStatement('select product0_.id as id1_0_, product0_.name as name2_0_ from product'))
          .to.equal('SELECT … FROM product');
      });

      it('must only discard uninteresting pieces', () => {
        expect(shortenSqlStatement('select product0_.id as id1_0_, product0_.name as name2_0_ from ' +
            'product product0_ where product0_.name is null'))
          .to.equal('SELECT … FROM product');
      });

      // this can actually happen. Who would have thought? :)
      // Seen on megazebra
      it('must not fail when SQL statements do not contain a FROM clause', () => {
        expect(shortenSqlStatement('show warnings'))
          .to.equal('show warnings');
      });
    });
  });
});
