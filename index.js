import { config } from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
console.log(dir)
const log = path.join(dir, 'log.txt');
const env = path.join(dir, '.env');

console.log(`Loading ${env}`);
console.log(`Log ${log}`);

config({ path: env });

const resolveIp = async () => {
    const ipSources = [
        "http://ifconfig.io/ip",
        "http://ifconfig.co/ip",
        "http://ipecho.net/plain",
        "http://icanhazip.com/",
        "http://ident.me/",
        "http://whatismyip.akamai.com/",
    ];
    
    for (const source of ipSources) {
        try {
            const { data } = await axios.get(source);
            return data;
        } catch (err) {
            console.log(`${source} failed...`);
            console.error(err);
        }
    }
}

const cf = axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4'
});

cf.defaults.headers.common['Authorization'] = `Bearer ${process.env.CF_AUTH_BEARER}`;

const ZONE_ID = process.env.ZONE_ID;
const RECORD_ID = process.env.RECORD_ID;

const runUpdate = async () => {
    try {
        const ip = await resolveIp();
    
        const response = await cf.patch(`/zones/${ZONE_ID}/dns_records/${RECORD_ID}`, {
            content: ip,
        });
    
        if (response.data.success) {
            console.log(`${new Date().toString()} Updated ${response.data.result.name} to ${response.data.result.content}`);
            fs.appendFileSync(log, `${new Date().toString()} Updated ${response.data.result.name} to ${response.data.result.content}\n`);
        }
    } catch (err) {
        console.error('Failed to update DNS record');
        console.error(err?.response?.data ?? err);
    }
};


setInterval(runUpdate, 30000);
runUpdate();

