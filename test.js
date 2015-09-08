var fs = require('fs');

describe('Listando pastas',function () {
    it('Deve mostrar as pastas no loca. ./',function () {
        fs.readdirSync( __dirname );
    });
});
