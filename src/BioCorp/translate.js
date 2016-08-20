var translate = require('node-google-translate-skidz');
var english = require('./i18n/en.json');
var fs = require('fs');

var french = new Object();

for(prop in english){
  translate({
    french: french,
    prop: prop,
    text: english[prop],
    source: 'en',
    target: 'fr'
  }, function(result, french) {
    // french[prop] = result;
    console.log(result);
    console.log(french);

    var stream = fs.createWriteStream("./i18n/fr.json");
    stream.once("open", function(fd) {
      stream.write(JSON.stringify(french));
      stream.end();
    });

  });
}

console.log("End");