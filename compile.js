const path = require('path');
const fs = require('fs');
const solc = require('solc');

const storePath = path.resolve(__dirname,'Contracts', 'Duber.sol');
const source = fs.readFileSync(storePath, 'utf8');

module.exports = solc.compile(source,1).contracts['Store'];
