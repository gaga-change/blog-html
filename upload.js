var qiniu = require('qiniu')
const proc = require("process");
let hideConfig = require('./hide.config.json') || {}
const path = require('path')
var bucket = hideConfig.bucket || proc.env.QINIU_TEST_BUCKET;
var accessKey = hideConfig.accessKey || proc.env.QINIU_ACCESS_KEY;
var secretKey = hideConfig.secretKey || proc.env.QINIU_SECRET_KEY;

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: bucket,
}
var putPolicy = new qiniu.rs.PutPolicy(options);

var uploadToken = putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
var localFile = path.join(__dirname, 'gulpfile.js')
//config.zone = qiniu.zone.Zone_z0;
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

//file
formUploader.putFile(uploadToken, 'gulpfile.js', localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }

  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});
