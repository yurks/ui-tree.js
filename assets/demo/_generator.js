var faker = require('faker');
var fs = require('fs');
var filename = 'test/test.src.json';


fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var result = data.replace(/"label":"[^"]*"/g, function() {
        return '"label":' + JSON.stringify(faker.company.companyName());
    });
    result = result.replace(/"id":"[^"]*"/g, function() {
        return '"id":' + JSON.stringify(faker.random.uuid());
    });
    fs.writeFile('test/test.json', result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});