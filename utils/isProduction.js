require('dotenv').config();

const isProduction = () =>{
    if (
      (process.env.IN_PRODUCTION && process.env.IN_PRODUCTION === "false") ||
      process.env.NODE_ENV === "local"
    )
      return false;
    return true;
}

module.exports = {
    isProduction
}   