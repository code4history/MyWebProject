import {exec} from 'node:child_process';
import dotenv from 'dotenv';
dotenv.config();

const backend = async () => { 
  if (process.env.DB_HOST) return process.env.DB_HOST;
  else return await new Promise<string>((resolve, reject) => {
    exec("ip route | grep 'default via' | grep -Eo '[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}'", (err, stdout, stderr) => { 
      if (err) {
        console.log(err);
        // エラーの処理
        resolve('localhost');
        return;
      }
      resolve(stdout.split('\n')[0]);
    });
  });
};

export default backend;