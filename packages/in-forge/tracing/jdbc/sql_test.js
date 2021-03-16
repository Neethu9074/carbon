/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
/* eslint-disable max-len */

import { expect } from 'chai';

import { formatSql, shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

describe('in-forge/tracing/jdbc/sql', () => {
  describe('formatSql', () => {
    it('must not explode when null is passed', () => {
      expect(formatSql(null)).to.equal(null);
    });

    describe('select statements', () => {
      it('must format simple select statements', () => {
        expect(formatSql('select name from person')).to.equal('SELECT name\nFROM person');
      });

      it('must indent where conditions', () => {
        expect(formatSql('select name from person where name = ? and age < ?')).to.equal(
          'SELECT name\nFROM person\nWHERE name = ?\n\tAND age < ?'
        );
      });

      it('must not break SOLLBESTAND', () => {
        expect(formatSql('update inventory SET SOLLBESTAND = ?')).to.equal('UPDATE inventory SET SOLLBESTAND = ?');
      });

      it('must not fail on incomplete sql', () => {
        expect(formatSql('select name from person WHERE foo')).to.equal('SELECT name\nFROM person\nWHERE foo');
      });

      it('must format statements with outer joins', () => {
        expect(formatSql('SELECT name from person outer join blub')).to.equal(
          'SELECT name\nFROM person\nOUTER JOIN blub'
        );
      });
    });
  });

  describe('shortenSqlStatement', () => {
    it('must not explode when null is passed', () => {
      expect(shortenSqlStatement(null)).to.equal(null);
    });

    describe('select statements', () => {
      it('must include count hint', () => {
        expect(shortenSqlStatement('select count(*) from product')).to.equal('SELECT COUNT … FROM product');
      });

      it('must not add excess ellipsis', () => {
        expect(shortenSqlStatement('select product0_.id as id1_0_, product0_.name as name2_0_ from product')).to.equal(
          'SELECT … FROM product'
        );
      });

      it('must not fail on incomplete sql', () => {
        expect(
          shortenSqlStatement('select product0_.id as id1_0_, product0_.name as name2_0_ from product WHERE foo')
        ).to.equal('SELECT … FROM product');
      });

      it('must only discard uninteresting pieces', () => {
        expect(
          shortenSqlStatement(
            'select product0_.id as id1_0_, product0_.name as name2_0_ from ' +
              'product product0_ where product0_.name is null'
          )
        ).to.equal('SELECT … FROM product');
      });

      // this can actually happen. Who would have thought? :)
      // Seen on megazebra
      it('must not fail when SQL statements do not contain a FROM clause', () => {
        expect(shortenSqlStatement('show warnings')).to.equal('show warnings');
      });

      it('must shorten SQL statements with leading and trailing whitespace', () => {
        expect(
          shortenSqlStatement(
            "\n        SELECT SocialNetworkId FROM SocialNetwork\n          WHERE SocialNetworkKey = 'facebook'\n      "
          )
        ).to.equal('SELECT … FROM SocialNetwork');
      });

      it('must shorten even funkies SQL statements', () => {
        expect(
          shortenSqlStatement(
            "\n        SELECT c.ChallengeId, c.DateTimeUser1, c.DateTimeUser2,\n      c.GameId, c.Level, c.UserId1, c.UserId2, c.ScoreUser1, c.ScoreUser2,\n      c.MessageUser1, c.MessageUser2, c.Status, g.GameKey _gameKey, u1.uid _uid1, u2.uid _uid2\n          FROM Challenge c, User u1, User u2, Game g\n          WHERE g.GameId=c.GameId\n            AND u1.UserId=c.UserId1 AND u2.UserId=c.UserId2\n            AND c.userId2 = 4636801 AND c.GameId IN (2,4,5,6,7,8,9,10,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28) AND c.Status IN ('I')\n        ORDER BY DateTimeUser1 DESC\n        LIMIT 5\n    "
          )
        ).to.equal('SELECT … FROM Challenge');
      });

      it('must shorten SQL statements with quoted from clause', () => {
        expect(shortenSqlStatement('SELECT * FROM `AppServer`\nORDER BY FOO')).to.equal('SELECT … FROM AppServer');
      });

      it('must shorten SQL statements with fields that contain from', () => {
        expect(
          shortenSqlStatement(
            'SELECT countryent5_.STREET_NORMALIZE_FROM as STREET_N7_13_3_, blubfrombla FROM CCP_CHECKOUT_DATA this_ left'
          )
        ).to.equal('SELECT … FROM CCP_CHECKOUT_DATA');
      });

      it('must shorten explain select statements', () => {
        expect(
          shortenSqlStatement(
            'EXPLAIN SELECT `User`.`id`, `User`.`username`, `User`.`password`, `User`.`unhashed_password`, `User`.`group_id`, `User`.`created`, `User`.`modified`, `User`.`firstname`, `User`.`lastname`, `User`.`zip`, `User`.`address`, `User`.`city`, `User`.`state`, `User`.`telephone`, `User`.`country`, `User`.`cc`, `User`.`expiry`, `User`.`cvv`, `User`.`ip`, `User`.`web`, `User`.`server_id`, `User`.`olduser`, `User`.`aff_id`, `User`.`b_id`, `User`.`chan`, `User`.`vbv`, `User`.`needRefund`, `User`.`aff_canceled`, `User`.`preauth_processed`, `User`.`preauthactive`, `User`.`processor_id`, `User`.`browser`, `User`.`version`, `User`.`platform`, `User`.`useragent`, `User`.`ref`, `User`.`donate`, `User`.`extend`, `User`.`tempsale`, `User`.`gateway`, `User`.`signuptheme`, `User`.`last_processor_id`, `User`.`signup_language`, `User`.`pubid`, `User`.`externalcode`, `User`.`email_member`, `User`.`email_promo`, `User`.`email_offers`, `User`.`survey`, `User`.`email_news`, `User`.`player_installed`, `User`.`movies_access`, `User`.`games_access`, `User`.`music_access`, `User`.`books_access`, `User`.`apps_access`, `User`.`post_checkout_page`, `User`.`post_checkout_action`, `User`.`post_checkout_plan_id`, `User`.`partner_domain`, `Subscription`.`id`, `Subscription`.`planid`, `Subscription`.`user_id`, `Subscription`.`created`, `Subscription`.`modified`, `Subscription`.`nextrecurring`, `Subscription`.`transaction_id`, `Subscription`.`retry`, `Subscription`.`loc`, `Subscription`.`amount`, `Subscription`.`frequency`, `Subscription`.`active`, `Subscription`.`recuring`, `Subscription`.`status`, `Subscription`.`cancel_date`, `Subscription`.`cancledfrom`, `Subscription`.`flow`, `Subscription`.`ref_id`, `Subscription`.`locked`, `Subscription`.`ref_id2` FROM users'
          )
        ).to.equal('EXPLAIN SELECT … FROM users');
      });

      it('must shorten activerecord sql calls', () => {
        expect(shortenSqlStatement('SELECT  "games".* FROM "games"  WHERE "games"."id" = $? LIMIT ?')).to.equal(
          'SELECT … FROM games'
        );
      });

      it('must shorten some special sql calls', () => {
        const sql = `SELECT top 20 this_.UserID as UserID1_115_7_, this_.dateEntered as dateEnte2_115_7_, this_.LastUpdated as LastUpda3_115_7_, this_.AddedByID as AddedBy60_115_7_, this_.lastUpdatedByUserId as lastUpd61_115_7_, this_.Active as Active4_115_7_, this_.address as address5_115_7_, this_.allowMessaging as allowMes6_115_7_, this_.altDeliveryId as altDeli62_115_7_, this_.assistantId as assista63_115_7_, this_.assistantName as assistan7_115_7_, this_.BuildingID as Buildin64_115_7_, this_.city as city8_115_7_, this_.comments as comments9_115_7_, this_.company as company10_115_7_, this_.copyAlert as copyAle11_115_7_, this_.costCenterId as costCen65_115_7_, this_.costCenter1 as costCen12_115_7_, this_.costCenter2 as costCen13_115_7_, this_.country as country14_115_7_, this_.countryCode as country15_115_7_, this_.custom01 as custom16_115_7_, this_.custom02 as custom17_115_7_, this_.custom03 as custom18_115_7_, this_.custom04 as custom19_115_7_, this_.custom05 as custom20_115_7_, this_.custom06 as custom21_115_7_, this_.custom07 as custom22_115_7_, this_.custom08 as custom23_115_7_, this_.custom09 as custom24_115_7_, this_.defAssetCenter as defAsse66_115_7_, this_.defCopyCenter as defCopy67_115_7_, this_.defFileRoomCenter as defFile68_115_7_, this_.defInventoryCenter as defInve69_115_7_, this_.defMailCenter as defMail70_115_7_, this_.defMaintenanceCenter as defMain71_115_7_, this_.defMoveCenter as defMove72_115_7_, this_.defReservationCenter as defRese73_115_7_, this_.defSpaceCenter as defSpac74_115_7_, this_.defVisitorCenter as defVisi75_115_7_, this_.deleteAlert as deleteA25_115_7_, this_.department as departm26_115_7_, this_.email as email27_115_7_, this_.employeeId as employe28_115_7_, this_.eulaAgreementDate as eulaAgr29_115_7_, this_.extension as extensi30_115_7_, this_.fax as fax31_115_7_, this_.firstName as firstNa32_115_7_, this_.floor as floor33_115_7_, this_.flWarden as flWarde34_115_7_, this_.isIofficeAdmin as isIoffi35_115_7_, this_.itemsPerPage as itemsPe36_115_7_, this_.jobTitle as jobTitl37_115_7_, this_.knownAs as knownAs38_115_7_, this_.languageCode as languag39_115_7_, this_.lastName as lastNam40_115_7_, this_.lastVisited as lastVis41_115_7_, this_.liveSearchItemsPerPage as liveSea42_115_7_, this_.mailAlert as mailAle43_115_7_, this_.mailStopId as mailSto76_115_7_, this_.middleName as middleN44_115_7_, this_.mobile as mobile45_115_7_, this_.MobileServiceId as MobileS77_115_7_, this_.moveAlert as moveAle46_115_7_, this_.pager as pager47_115_7_, this_.ParkingSpaceRoomId as Parking78_115_7_, this_.parkingSpace as parking48_115_7_, this_.password as passwor49_115_7_, this_.phone as phone50_115_7_, this_.postalCode as postalC51_115_7_, this_.RoomID as RoomID79_115_7_, this_.room as room52_115_7_, this_.showHelp as showHel53_115_7_, this_.siteAdmin as siteAdm54_115_7_, this_.specialNeeds as special55_115_7_, this_.state as state56_115_7_, this_.systemUse as systemU57_115_7_, this_.userName as userNam58_115_7_, this_.userTypeId as userTyp80_115_7_, this_.visitorAlert as visitor59_115_7_, room1_.roomId as roomId1_80_0_, room1_.dateEntered as dateEnte2_80_0_, room1_.lastUpdated as lastUpda3_80_0_, room1_.enteredByUserId as entered16_80_0_, room1_.lastUpdatedByUserId as lastUpd17_80_0_, room1_.active as active4_80_0_, room1_.squareFeet as squareFe5_80_0_, room1_.capacity as capacity6_80_0_, room1_.signNumber as signNumb7_80_0_, room1_.exchangeAddress as exchange8_80_0_, room1_.floorId as floorId18_80_0_, room1_.googleCalAddress as googleCa9_80_0_, room1_.googleCalResourceId as googleC10_80_0_, room1_.googleSyncToken as googleS11_80_0_, room1_.longDescription as longDes12_80_0_, room1_.mailStopId as mailSto19_80_0_, room1_.roomName as roomNam13_80_0_, room1_.rentableSquareFeet as rentabl14_80_0_, room1_.reservable as reserva15_80_0_, room1_.RoomTypeID as RoomTyp20_80_0_, floor4_.floorId as floorId1_103_1_, floor4_.dateEntered as dateEnte2_103_1_, floor4_.lastUpdated as lastUpda3_103_1_, floor4_.enteredByUserId as enteredB8_103_1_, floor4_.lastUpdatedByUserId as lastUpda9_103_1_, floor4_.active as active4_103_1_, floor4_.squareFeet as squareFe5_103_1_, floor4_.FieldId as FieldId10_103_1_, floor4_.CurrentDrawing as Current11_103_1_, floor4_.FloorName as FloorNam6_103_1_, floor4_.sortOrder as sortOrde7_103_1_, building5_.fieldId as fieldId1_32_2_, building5_.dateEntered as dateEnte2_32_2_, building5_.dateUpdated as dateUpda3_32_2_, building5_.enteredByUserId as entered15_32_2_, building5_.lastUpdatedByUserId as lastUpd16_32_2_, building5_.active as active4_32_2_, building5_.city as city5_32_2_, building5_.CountryID as Country17_32_2_, building5_.postalCode as postalCo6_32_2_, building5_.stateId as stateId18_32_2_, building5_.address as address7_32_2_, building5_.address2 as address8_32_2_, building5_.buildingCode as building9_32_2_, building5_.latitude as latitud10_32_2_, building5_.longitude as longitu11_32_2_, building5_.name as name12_32_2_, building5_.parkingFlag as parking13_32_2_, building5_.sortOrder as sortOrd14_32_2_, mailstop6_.StopID as StopID1_51_3_, mailstop6_.active as active2_51_3_, mailstop6_.BuildingID as Building5_51_3_, mailstop6_.CenterID as CenterID6_51_3_, mailstop6_.StopName as StopName3_51_3_, mailstop6_.routeId as routeId7_51_3_, mailstop6_.sortOrder as sortOrde4_51_3_, building7_.fieldId as fieldId1_32_4_, building7_.dateEntered as dateEnte2_32_4_, building7_.dateUpdated as dateUpda3_32_4_, building7_.enteredByUserId as entered15_32_4_, building7_.lastUpdatedByUserId as lastUpd16_32_4_, building7_.active as active4_32_4_, building7_.city as city5_32_4_, building7_.CountryID as Country17_32_4_, building7_.postalCode as postalCo6_32_4_, building7_.stateId as stateId18_32_4_, building7_.address as address7_32_4_, building7_.address2 as address8_32_4_, building7_.buildingCode as building9_32_4_, building7_.latitude as latitud10_32_4_, building7_.longitude as longitu11_32_4_, building7_.name as name12_32_4_, building7_.parkingFlag as parking13_32_4_, building7_.sortOrder as sortOrd14_32_4_, mailcenter8_.CenterID as CenterID2_34_5_, mailcenter8_.active as active3_34_5_, mailcenter8_.comments as comments4_34_5_, mailcenter8_.dateEntered as dateEnte5_34_5_, mailcenter8_.LastUpdated as LastUpda6_34_5_, mailcenter8_.CenterTypeCode as CenterTy1_34_5_, mailcenter8_.CenterName as CenterNa7_34_5_, mailcenter8_.TimeZoneID as TimeZone9_34_5_, mailcenter8_.useTimeChange as useTimeC8_34_5_, roomtype9_.roomTypeId as roomType1_82_6_, roomtype9_.dateEntered as dateEnte2_82_6_, roomtype9_.dateUpdated as dateUpda3_82_6_, roomtype9_.enteredByUserId as entered12_82_6_, roomtype9_.lastUpdatedByUserId as lastUpd13_82_6_, roomtype9_.active as active4_82_6_, roomtype9_.CenterId as CenterI14_82_6_, roomtype9_.RoomTypeColor as RoomType5_82_6_, roomtype9_.contentFlag as contentF6_82_6_, roomtype9_.RoomTypeCost as RoomType7_82_6_, roomtype9_.defaultRoomType as defaultR8_82_6_, roomtype9_.RoomTypeDesc as RoomType9_82_6_, roomtype9_.sortOrder as sortOrd10_82_6_, roomtype9_.RoomTypeCode as RoomTyp11_82_6_
        FROM dbo.Users this_ left
        OUTER JOIN dbo.MoveRoomList room1_ on this_.RoomID=room1_.roomId left
        OUTER JOIN dbo.SpaceFloors floor4_ on room1_.floorId=floor4_.floorId left
        OUTER JOIN dbo.Buildings building5_ on floor4_.FieldId=building5_.fieldId left
        OUTER JOIN dbo.MailInStops mailstop6_ on room1_.mailStopId=mailstop6_.StopID left
        OUTER JOIN dbo.Buildings building7_ on mailstop6_.BuildingID=building7_.fieldId left
        OUTER JOIN dbo.Centers mailcenter8_ on mailstop6_.CenterID=mailcenter8_.CenterID left
        OUTER JOIN dbo.MoveRoomTypes roomtype9_ on room1_.RoomTypeID=roomtype9_.roomTypeId
        WHERE (this_.Active=?
        AND this_.systemUse=?
        AND this_.mailStopId is not null
        AND ((this_.firstName like ? or this_.lastName like ? or this_.knownAs like ? or this_.firstName like ? or this_.lastName like ? or this_.email like ? or this_.employeeId like ? or room1_.roomName like ?)))
        ORDER BY this_.firstName asc, this_.lastName asc`;

        expect(shortenSqlStatement(sql)).to.equal('SELECT … FROM dbo.Users');
      });
    });

    describe('update statements', () => {
      it('must shorten update statements', () => {
        expect(
          shortenSqlStatement('  \nUPDATE PlayWeekly SET `GamesPlayedCount`=117\nWHERE `YearWeek`=201636  \n')
        ).to.equal('UPDATE PlayWeekly SET …');
      });

      it('must shorten update statements with quoted table', () => {
        expect(
          shortenSqlStatement('  \nUPDATE `PlayWeekly` SET `GamesPlayedCount`=117\nWHERE `YearWeek`=201636  \n')
        ).to.equal('UPDATE PlayWeekly SET …');
      });
    });

    describe('insert statements', () => {
      it('must shorten insert statements', () => {
        expect(
          shortenSqlStatement("  \nINSERT  INTO example \n (field1, field2, field3) VALUES ('test', 'N', NULL);  \n")
        ).to.equal('INSERT INTO example …');
      });

      it('must shorten insert statements with quoted table', () => {
        expect(
          shortenSqlStatement("  \nINSERT  INTO `example` \n (field1, field2, field3) VALUES ('test', 'N', NULL);  \n")
        ).to.equal('INSERT INTO example …');
      });
    });
  });
});
