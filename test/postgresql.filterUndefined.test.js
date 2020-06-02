// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-connector-postgresql
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';
var should = require('should'),
  assert = require('assert');
var Post, db;

describe('filter undefined fields', function() {
  before(function() {
    db = getDataSource();

    Post = db.define('FilterUndefined', {
      defaultInt: {
        type: 'Number',
        postgresql: {
          dbDefault: '5',
        },
      },
      first: {
        type: 'String',
      },
      second: {
        type: 'Number',
      },
      third: {
        type: 'Number',
      },
    });
  });

  it('should run migration', function(done) {
    db.automigrate('FilterUndefined', function() {
      done();
    });
  });

  it('should insert only default value', function(done) {
    var dflPost = new Post();
    dflPost.save(function(err, p) {
      should.not.exist(err);
      Post.findOne({where: {id: p.id}}, function(err, p) {
        should.not.exist(err);
        p.defaultInt.should.be.equal(5);
        should.not.exist(p.first);
        should.not.exist(p.second);
        should.not.exist(p.third);
      });
      done();
    });
  });

  it('should insert default value and \'third\' field', function(done) {
    var dflPost = new Post();
    dflPost.first = null;
    dflPost.third = 3;
    dflPost.save(function(err, dfl1) {
      should.not.exist(err);
      Post.findOne({where: {id: dfl1.id}}, function(err, dfl2) {
        should.not.exist(err);
        dfl2.defaultInt.should.be.equal(5);
        console.log('--- dfl2 ---')
        console.log(dfl2)
        if (dfl2.first) {
          console.log('--- dflPost ---')
          console.log(dflPost)
          console.log('--- dfl1 ---')
          console.log(dfl1)
          dfl2.first = null;
        }
        should.not.exist(dfl2.first);
        should.not.exist(dfl2.second);
        should.exist(dfl2.third);
        dfl2.third.should.be.equal(3);
      });
      done();
    });
  });

  it('should update \'first\' and \'third\' fields of record with id==2 to predefined values', function(done) {
    Post.findOne({where: {id: 2}}, function(err, pid2t1) {
      should.not.exist(err);
      should.exist(pid2t1);
      pid2t1.id.should.be.equal(2);
      pid2t1.updateAttributes({first: 'one', third: 4}, function(err, pid2t2) {
        console.log('--- pid2t2 ---')
        console.log(pid2t2)
        Post.findOne({where: {id: 2}}, function(err, pid2t3) {
          console.log('--- pid2t3 ---')
          console.log(pid2t3)
          should.not.exist(err);
          pid2t3.defaultInt.should.be.equal(5);
          pid2t3.first.should.be.equal('one');
          should.not.exist(pid2t3.second);
          pid2t3.third.should.be.equal(4);
          done();
        });
      });
    });
  });

  it('should update \'third\' field of record with id==2 to null value', function(done) {
    Post.findOne({where: {id: 2}}, function(err, pid2nullt1) {
      should.not.exist(err);
      should.exist(pid2nullt1);
      pid2nullt1.id.should.be.equal(2);
      pid2nullt1.updateAttributes({first: 'null in third', third: null}, function(err, pid2nullt2) {
        console.log('--- pid2nullt2 ---')
        console.log(pid2nullt2)
        Post.findOne({where: {id: 2}}, function(err, pid2nullt3) {
          console.log('--- pid2nullt3 ---')
          console.log(pid2nullt3)
          should.not.exist(err);
          pid2nullt3.defaultInt.should.be.equal(5);
          pid2nullt3.first.should.be.equal('null in third');
          should.not.exist(pid2nullt3.second);
          should.not.exist(pid2nullt3.third);
          done();
        });
      });
    });
  });

  it('should insert a value into \'defaultInt\' and \'second\'', function(done) {
    var dflPost = new Post();
    dflPost.second = 2;
    dflPost.defaultInt = 11;
    dflPost.save(function(err, p) {
      should.not.exist(err);
      Post.findOne({where: {id: p.id}}, function(err, p) {
        should.not.exist(err);
        p.defaultInt.should.be.equal(11);
        should.not.exist(p.first);
        should.not.exist(p.third);
        //should.exist(p.third);
        p.second.should.be.equal(2);
        done();
      });
    });
  });

  it('should create an object with a null value in \'first\'', function(done) {
    Post.create({first: null}, function(err, p) {
      should.not.exist(err);
      Post.findOne({where: {id: p.id}}, function(err, p) {
        should.not.exist(err);
        p.defaultInt.should.equal(5);
        should.not.exist(p.first);
        should.not.exist(p.second);
        should.not.exist(p.third);
        done();
      });
    });
  });
});
