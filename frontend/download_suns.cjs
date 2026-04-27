const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join('c:', 'Users', 'User', 'OneDrive', 'Desktop', 'New folder (7)', 'frontend', 'public', 'images', 'sun_carousel');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const prompts = {
    '30': 'A very dim realistic yellow sun in outer space pitch black background',
    '45': 'A moderately bright realistic yellow sun in outer space pitch black background',
    '65': 'A bright realistic yellow sun in outer space pitch black background',
    '75': 'A very bright realistic glowing yellow sun in outer space pitch black background',
    '88': 'An intensely bright glowing yellow sun plasma in outer space pitch black background',
    '92': 'An extremely blinding white yellow sun plasma in outer space pitch black background'
};

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function run() {
    for (const [key, prompt] of Object.entries(prompts)) {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
        const dest = path.join(dir, `sun_${key}.jpg`);
        console.log(`Downloading ${key}% sun...`);
        try {
            await download(url, dest);
            console.log(`✅ Downloaded sun_${key}.jpg`);
        } catch (err) {
            console.error(`❌ Failed sun_${key}.jpg`, err);
        }
    }
}

run();
