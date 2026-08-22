const https = require('https');
const fs = require('fs');

const url = 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_51cb4b7261.mp3';
const file = fs.createWriteStream('assets/romantic.mp3');

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
}, function(response) {
    if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, function(redirectResponse) {
             redirectResponse.pipe(file);
        });
    } else {
        response.pipe(file);
    }
}).on('error', function(err) {
    console.error('Error downloading:', err);
});
