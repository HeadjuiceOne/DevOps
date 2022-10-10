const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')
const { get } = require('../src/routes/user')

describe('User', () => {

  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })

  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done)=> {
      const user_1 =
      {
       username : 'head',
       firstname : 'PA',
       lastname : 'Cha'
      }
      const user_2 =
      {
        username : 'tom',
        firstname : 'Thomas',
        lastname : 'Chopin'
      }

      db.exists(user_1.username, (err,result) => {
        if(result === 1)
        {
          console.log("L'user existe !\n")
        }
        else
        {
          userController.create(user_2, (err, result) => {
            expect(err).to.not.be.equal(null)
            expect(result).to.be.equal(null)
            console.log("L'user existe pas !\n")
          })
        }
        done()
      })
    })

  })

  // TODO Create test for the get method
  describe('Get', ()=> {

     it('get a user by username', (done) => {
       // 1. First, create a user to make this unit test independent from the others
       const user1 =
       {
        username : 'head',
        firstname : 'PA',
        lastname : 'Cha'
       }

       userController.create(user1, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal("OK")
      })

       // 2. Then, check if the result of the get method is correct
       db.hgetall(user1.username,(err,result) =>
       {
        console.log(err)
        console.log(result)
        expect(err).to.be.equal(null)
        expect(result.firstname).to.be.equal(user1.firstname)
        expect(result.lastname).to.be.equal(user1.lastname)

       })

       done()
     })

     it('cannot get a user when it does not exist', (done) => {
       // Check with any invalid user
       const user2 =
       {
        username : 'tom',
        firstname : 'Thomas',
        lastname : 'Chopin'
       }

       userController.create(user2, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal("OK")
      })

      db.exists(user2.username, (err,result) => {
        if(result === 1)
        {
          console.log("It exists !\n")
        }
        else console.log("It does not exist !\n")
      })

       done()
     })

  })
})
