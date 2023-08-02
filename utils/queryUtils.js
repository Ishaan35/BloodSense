const db = require("../db/db");

const queryPromise = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = { queryPromise };
