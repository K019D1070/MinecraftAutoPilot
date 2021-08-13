const Rcon = require("rcon-client");
const fs = require('fs/promises');
const cp = require('child_process');

let charrange = 0;
main();
async function main(){
  const rcon = await Rcon.Rcon.connect({
    host:"127.0.0.1",
    port:25576,
    password:"TDNTNOK111"
  }).catch((err)=>{
    console.error(err);
    process.exit();
  });
  rcon.send("stop");
  rcon.end();
  await check();
}
function check(){
  return new Promise((stopped, failed)=>{
    if(charrange++ > 4 * 60){
      failed("Server stopping was failed.");
    };
    let intvl = setInterval(async ()=>{
      try{
        let statusFile = await fs.open(".\\stop.status");
        let status = (await statusFile.readFile()).toString();
        statusFile.close();
        console.log(status);
        console.log(/stopped/.test(status));
        if(/stopped/.test(status)){
          clearInterval(intvl);
          stopped();
        }
      }catch{
        //stop.status is under accesible.
        //But it will be solved by time elapsing.
      }
    }, 250);
  });
}