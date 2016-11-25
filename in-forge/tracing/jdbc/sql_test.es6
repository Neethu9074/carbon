/* eslint-env mocha */
/* eslint-disable max-len */

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
      it('must include count hint', () => {
          expect(shortenSqlStatement('select count(*) from product'))
            .to.equal('SELECT COUNT … FROM product');
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

      it('must shorten SQL statements with leading and trailing whitespace', () => {
        expect(shortenSqlStatement("\n        SELECT SocialNetworkId FROM SocialNetwork\n          WHERE SocialNetworkKey = 'facebook'\n      "))
          .to.equal('SELECT … FROM SocialNetwork');
      });

      it('must shorten even funkies SQL statements', () => {
        expect(shortenSqlStatement("\n        SELECT c.ChallengeId, c.DateTimeUser1, c.DateTimeUser2,\n      c.GameId, c.Level, c.UserId1, c.UserId2, c.ScoreUser1, c.ScoreUser2,\n      c.MessageUser1, c.MessageUser2, c.Status, g.GameKey _gameKey, u1.uid _uid1, u2.uid _uid2\n          FROM Challenge c, User u1, User u2, Game g\n          WHERE g.GameId=c.GameId\n            AND u1.UserId=c.UserId1 AND u2.UserId=c.UserId2\n            AND c.userId2 = 4636801 AND c.GameId IN (2,4,5,6,7,8,9,10,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28) AND c.Status IN ('I')\n        ORDER BY DateTimeUser1 DESC\n        LIMIT 5\n    "))
          .to.equal('SELECT … FROM Challenge');
      });

      it('must shorten SQL statements with quoted from clause', () => {
        expect(shortenSqlStatement('SELECT * FROM `AppServer`\nORDER BY FOO'))
          .to.equal('SELECT … FROM AppServer');
      });

      it('must shorten SQL statements with fields that contain from', () => {
        expect(shortenSqlStatement('SELECT countryent5_.STREET_NORMALIZE_FROM as STREET_N7_13_3_, blubfrombla FROM CCP_CHECKOUT_DATA this_ left'))
          .to.equal('SELECT … FROM CCP_CHECKOUT_DATA');
      });

      it('must shorten explain select statements', () => {
        expect(shortenSqlStatement('EXPLAIN SELECT `User`.`id`, `User`.`username`, `User`.`password`, `User`.`unhashed_password`, `User`.`group_id`, `User`.`created`, `User`.`modified`, `User`.`firstname`, `User`.`lastname`, `User`.`zip`, `User`.`address`, `User`.`city`, `User`.`state`, `User`.`telephone`, `User`.`country`, `User`.`cc`, `User`.`expiry`, `User`.`cvv`, `User`.`ip`, `User`.`web`, `User`.`server_id`, `User`.`olduser`, `User`.`aff_id`, `User`.`b_id`, `User`.`chan`, `User`.`vbv`, `User`.`needRefund`, `User`.`aff_canceled`, `User`.`preauth_processed`, `User`.`preauthactive`, `User`.`processor_id`, `User`.`browser`, `User`.`version`, `User`.`platform`, `User`.`useragent`, `User`.`ref`, `User`.`donate`, `User`.`extend`, `User`.`tempsale`, `User`.`gateway`, `User`.`signuptheme`, `User`.`last_processor_id`, `User`.`signup_language`, `User`.`pubid`, `User`.`externalcode`, `User`.`email_member`, `User`.`email_promo`, `User`.`email_offers`, `User`.`survey`, `User`.`email_news`, `User`.`player_installed`, `User`.`movies_access`, `User`.`games_access`, `User`.`music_access`, `User`.`books_access`, `User`.`apps_access`, `User`.`post_checkout_page`, `User`.`post_checkout_action`, `User`.`post_checkout_plan_id`, `User`.`partner_domain`, `Subscription`.`id`, `Subscription`.`planid`, `Subscription`.`user_id`, `Subscription`.`created`, `Subscription`.`modified`, `Subscription`.`nextrecurring`, `Subscription`.`transaction_id`, `Subscription`.`retry`, `Subscription`.`loc`, `Subscription`.`amount`, `Subscription`.`frequency`, `Subscription`.`active`, `Subscription`.`recuring`, `Subscription`.`status`, `Subscription`.`cancel_date`, `Subscription`.`cancledfrom`, `Subscription`.`flow`, `Subscription`.`ref_id`, `Subscription`.`locked`, `Subscription`.`ref_id2` FROM users'))
          .to.equal('EXPLAIN SELECT … FROM users');
      });
    });

    describe('update statements', () => {
      it('must shorten update statements', () => {
        expect(shortenSqlStatement('  \nUPDATE PlayWeekly SET `GamesPlayedCount`=117\nWHERE `YearWeek`=201636  \n'))
          .to.equal('UPDATE PlayWeekly SET …');
      });

      it('must shorten update statements with quoted table', () => {
        expect(shortenSqlStatement('  \nUPDATE `PlayWeekly` SET `GamesPlayedCount`=117\nWHERE `YearWeek`=201636  \n'))
          .to.equal('UPDATE PlayWeekly SET …');
      });
    });

    describe('insert statements', () => {
      it('must shorten insert statements', () => {
        expect(shortenSqlStatement("  \nINSERT  INTO example \n (field1, field2, field3) VALUES ('test', 'N', NULL);  \n"))
          .to.equal('INSERT INTO example …');
      });

      it('must shorten insert statements with quoted table', () => {
        expect(shortenSqlStatement("  \nINSERT  INTO `example` \n (field1, field2, field3) VALUES ('test', 'N', NULL);  \n"))
          .to.equal('INSERT INTO example …');
      });
    });
  });
});
