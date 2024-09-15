const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();


const secretManager = new AWS.SecretsManager({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

class SecretsManagerService {
    async getSecret(secretName) {
        try {
            const data = await secretManager.getSecretValue({ SecretId: secretName }).promise();
            if ('SecretString' in data) {
                return JSON.parse(data.SecretString);
            } else {
                throw new Error('Secret binary is not supported');
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};


module.exports = new SecretsManagerService();