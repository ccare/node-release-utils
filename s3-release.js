var fs = require('fs');
var child_process = require('child_process'); 

var S3_KEY = process.env.TALIS_AWS_ACCESS_KEY_ID;
var S3_SECRET = process.env.TALIS_AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.argv[2];
var PUBLISH_ROOT = "nodejs/";
var PACKAGE_JSON_FILE = 'package.json';
var JSON_INDENT = 4;

// S3 client
var knox = require('knox').createClient({
    key: S3_KEY,
    secret: S3_SECRET,
    bucket: S3_BUCKET
});

function buildTagCmd(tagName) {
    return 'git tag ' + tagName
}

function buildCommitCmd(message) {
    return 'git commit -m "' + message + '" package.json; git push origin master'
}

function commitPackageFile(callback) {
    var cmd = buildCommitCmd('Incrementing version number for next iteration')
    exec(cmd, callback)
}

function tagRepo(tagName, callback) {
    var tagCmd = buildTagCmd(tagName)
    exec(tagCmd, callback)
}

function exec(cmd, callback) {
    console.log("Running %s", cmd)
    child_process.exec(cmd, callback)    
}

function readJSON(file) {
    var jsonStr = fs.readFileSync(PACKAGE_JSON_FILE)
    return JSON.parse(jsonStr);
}

function writeJSON(file) {
    var jsonStr = JSON.stringify(file, null, JSON_INDENT)
    fs.writeFileSync(PACKAGE_JSON_FILE, jsonStr)
}

function incrementVersionInJson(packageJson) {
    var version = packageJson.version.split('.');
    version[version.length-1]++;
    var newVersion = version.join('.');
    packageJson.version = newVersion;
    return newVersion;    
}

function tagAndIncrementVersion(callback) {
    var packageJson = readJSON(PACKAGE_JSON_FILE);
    var tagName = packageJson.name + '-' + packageJson.version
    tagRepo(tagName, function (error, stdout, stderr) {
        var newVersion = incrementVersionInJson(packageJson)
        console.log("Updating version in package.json to %s", newVersion)
        writeJSON(packageJson)
        commitPackageFile(function (error, stdout, stderr) {
            callback(packageJson.name, tagName)
        })    
    })
}

function checkoutAndPack(packageName, newTag) {
    var cmd = "rm -rf target; mkdir target; cd target; git clone ../.git code >/dev/null; cd code; git checkout " + newTag + " >/dev/null; npm pack;"
    exec(cmd, function (error, stdout, stderr) {
        var fileName = stdout.replace('./','').replace("\n", '')
        upload('target/code/' + fileName, PUBLISH_ROOT + packageName + '/' + fileName)
        pushTag(newTag)
    })
}

function pushTag(tagName) {
    var cmd = 'git push origin ' + tagName
    child_process.exec(cmd, function (error, stdout, stderr) {
    })
}

function upload(srcPath, targetPath) {
    knox.putFile(srcPath, targetPath, {}, function(err, result) {
        if (err) { console.log(err) }
        else if (200 == result.statusCode) { console.log('Uploaded %s to Amazon S3', srcPath); }
        else { console.log('Failed to upload file to Amazon S3'); }
       // exec('rm -rf target')
    });
}

tagAndIncrementVersion(function(packageName, newTag) {
    checkoutAndPack(packageName, newTag);   
})
