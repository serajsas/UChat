const moment = require('moment-timezone');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().tz('America/Vancouver').format(' h:mm a')
  };
}

module.exports = formatMessage;
