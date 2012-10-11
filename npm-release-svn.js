var fs = require('fs');
var child_process = require('child_process');

var PACKAGE_JSON_FILE = 'package.json';
var JSON_INDENT = 4;

function buildTagCmd(tagName) {
	return 'git tag ' + tagName
}

function buildCommitCmd(message){
	return 'svn commit -m "' + message + '" package.json'
}

function commitPackageFile(callback) {
	var cmd = buildCommitCmd('Incrementing version number for next iteration')
	exec(cmd, callback)
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
	var newVersion = incrementVersionInJson(packageJson)
	console.log("Updating version in package.json to %s", newVersion)
	writeJSON(packageJson)
	commitPackageFile(function (error, stdout, stderr) {
		callback(packageJson.name, tagName)
	})
}

function checkoutAndPack(packageName, newTag){
	getRepoUrl(function(repoUrl){
		var tagsUrl = repoUrl.substr(0,repoUrl.indexOf("trunk"))+"tags/"
		var cmd = "rm -rf target; svn co " + repoUrl + " target ; cd target ; npm publish;"
		exec(cmd, function (error, stdout, stderr) {
			pushTag(newTag,tagsUrl)
		})
	})
}

function pushTag(tagName, tagsUrl) {
	var cmd = 'svn copy . ' + tagsUrl + tagName +' -m " Tag '+tagName+'"'
	exec(cmd, function (error, stdout, stderr) {
	})
}

function getRepoUrl (callback){
	var cmd = 'svn info | grep "^URL" | cut -d " " -f 2'
	exec(cmd, function (error, stdout, stderr) {
		callback(stdout.trim())
	})
}

tagAndIncrementVersion(function(packageName, newTag) {
	checkoutAndPack(packageName, newTag);
})
