const moment = require('moment-timezone');

function formatMessage(username, text,color) {

  return {
    username,
    text,
    time: moment().tz('America/Vancouver').format(' h:mm a'),
    color
  };
}

module.exports = formatMessage;
