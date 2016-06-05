var start = Date.now();

process.on("exit", function() {
  var end = Date.now();
  console.log("Time taken: %ds", (end - start)/1000);
});

var deleteFolderRecursive = function (path) {
    var fs = require('fs');
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
for(var i= 0; i < 200; i++){
    var testFolder = 'test' + i;
    var outputFolder = testFolder + '/output';
    var seqFile = testFolder + '/seq';
    deleteFolderRecursive(testFolder);
    fs.mkdirSync(testFolder);
    fs.mkdirSync(outputFolder);
    fs.writeFileSync(seqFile, '>gi|395400|emb|X66515|ECTRALA E.coli tRNA-Ala\n' 
    + 'GGGGCTATAGCTCAGCTGGGAGAGCGCTTGCATGGCATGCAAGAGGTCAGCGGTTCGATCCCGCTTAGCTCCACCA');
    exec('~/PhdResearch/Ribosoft/sfold-2.2/bin/sfold -o ' + outputFolder + ' ' + seqFile, 
        function(err, stdout, stderr) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
    });   
}
console.log('Done');
