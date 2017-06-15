const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient

function getAllBookings (req, res, cb) {
  const filtered = []
  getDatabase((err, db) => {
    if (err) return console.log("err:", err)
    db.collection('bookings').find().toArray((err, results) => {
      if (err) return {error: err}
      for (let i = 0; i < results.length; i++) {
        filtered.push({anonBooking: {
          startDate: results[i].startDate,
          endDate: results[i].endDate,
          confirmed: results[i].confirmed}
        })
      }
      cb(null, filtered)
    })
  })
}
function adminGetAllBookings (req, res, cb) {
  getDatabase((err, db) => {
    if (err) return console.log("err:", err)
    db.collection('bookings').find().toArray((err, results) => {
      if (err) return {error: err}
      cb(null, results)
    })
  })
}

function userAddBooking (req, res, cb) {
  getDatabase((err, db) => {
    if (err) return console.log("err:", err)
    db.collection('bookings').save(req.body, (err, result) => {
      if (err) return res.json({error: err})
      cb(null, {id: result.ops[0]._id})
    })
  })
}

function confirmBooking (req, res, cb) {
  getDatabase((err, db) => {
    if (err) return console.log("err:", err)
    db.collection('bookings').update({_id: ObjectId(req.params.id)}, {$set: {'confirmed': true}}, (err, result) => {
      if (err) {
        return res.json({error: err})
      } else if (result.ok === 1) {
        cb({updated: true})
      }
    })
  })
}

function addUser (req, res, cb) {
  getDatabase((err, db) => {
    if (err) return console.log("err:", err)
    db.collection('users').save(req.body, (err, result) => {
      if (err) return res.json({error: err})
      cb(null, {id: result.ops[0]._id})
    })
  })
}
module.exports = {
  getAllBookings,
  adminGetAllBookings,
  userAddBooking,
  confirmBooking,
  addUser
}

function getDatabase (callback) {
  MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) return callback(err)
    const db = database.db('admin') // To be changed before deployment to a database for production
    db.authenticate(process.env.DB_USER, process.env.DB_PW, (err, result) => {
      if (err) return {error: err}
      callback(null, db)
    })
  })
}