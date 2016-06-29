const dotenv = require('dotenv');
const fs = require('fs');
const sampleVars = dotenv.parse(fs.readFileSync('./environments/envTemplate'));

function difference(arrA, arrB) {
  return arrA.filter((a) => arrB.indexOf(a) < 0);
}

function compact(obj) {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  return result;
}

module.exports = () => {
  const missing = difference(Object.keys(sampleVars), Object.keys(compact(process.env)));
  if (missing.length > 0) {
    const message = `Missing environment variables: ${missing.join(', ')}`;
    throw new Error(message);
  }
};
