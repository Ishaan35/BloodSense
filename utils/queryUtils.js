const db = require("../db/postgresDb");

const queryPromise = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result.rows);
    });
  });
};

module.exports = { queryPromise };
