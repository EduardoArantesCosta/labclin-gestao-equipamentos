import { S3Client } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;

// Use o endpoint exibido no painel do seu bucket no Railway.
// Exemplo: https://<seu-endpoint-s3>
const endpoint = process.env.BUCKET_ENDPOINT;

if (!bucketName) {
  throw new Error("BUCKET não configurada");
}

if (!accessKeyId) {
  throw new Error("ACCESS_KEY_ID não configurada");
}

if (!secretAccessKey) {
  throw new Error("SECRET_ACCESS_KEY não configurada");
}

if (!region) {
  throw new Error("REGION não configurada");
}

if (!endpoint) {
  throw new Error("BUCKET_ENDPOINT não configurada");
}

export { bucketName };

export const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
