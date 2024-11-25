import { v2 as cloud, ConfigOptions } from "cloudinary";

const cloudConfig: ConfigOptions = {
  api_key: process.env.CLOUD_API_KEY || "",
  api_secret: process.env.CLOUD_API_SECRET || "",
  cloud_name: process.env.CLOUD_API_NAME || "",
  secure: true,
};

// Verificar si las variables de entorno están definidas
if (!cloudConfig.api_key || !cloudConfig.api_secret || !cloudConfig.cloud_name) {
  console.error("Error: Cloudinary configuration variables are missing.");
} else {
  cloud.config(cloudConfig);
}

export default cloud;