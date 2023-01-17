const path = require('path');
const fs = require('fs');
const mkcert = require('mkcert');
const { spawn  } = require('child_process');

mkcert.createCA({
    organization: 'Digital River Dev localhost',
    countryCode: 'US',
    state: 'MN',
    locality: 'Minnetonka',
    key: path.resolve(__dirname,'../config/ssl/ca.key'),
    cert: path.resolve(__dirname,'../config/ssl/ca.crt'),
    validityDays: 365
})
.then((ca)=> {
    fs.writeFileSync(path.resolve(__dirname,'../config/ssl/ca.crt'),ca.cert);
    fs.writeFileSync(path.resolve(__dirname,'../config/ssl/ca.key'),ca.key);
    mkcert.createCert({
        domains: ['localhost','127.0.0.1'],
        validityDays: 365,
        caKey: ca.key,
        caCert: ca.cert
    })
        .then((cert)=> {
            let crt_path = path.resolve(__dirname,'../config/ssl/ca.crt');
            fs.writeFileSync(path.resolve(__dirname,'../config/ssl/localhost.pem'),cert.cert);
            fs.writeFileSync(path.resolve(__dirname,'../config/ssl/localhost-key.pem'),cert.key);

            if (process.platform === 'win32' || process.platform === 'win64') {
                spawn("powershell.exe",
                    ["-Command \"Start-Process 'certutil.exe' -Argument '-addstore \"Root\" "+crt_path+"' -Verb RunAs\""]
                    , { shell: true });
            }
        })
        .catch(err=> console.error(err));
})
.catch(err=> console.error(err));

