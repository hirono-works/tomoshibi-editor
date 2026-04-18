// generate-env.js
const fs = require('fs');

// Vercel上の環境変数を取得して、env.js の内容を組み立てる
const content = `
const CONFIG = {
    GAPI_API_KEY: "${process.env.GAPI_API_KEY || ''}",
    GAPI_CLIENT_ID: "${process.env.GAPI_CLIENT_ID || ''}",
    DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    SCOPES: 'https://www.googleapis.com/auth/drive.file'
};
`;

// env.js を書き出す
try {
    fs.writeFileSync('./env.js', content);
    console.log('✅ env.js has been generated successfully.');
} catch (err) {
    console.error('❌ Error generating env.js:', err);
    process.exit(1);
}