const conf = {
  apiBase: import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8080/api/v1`,
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  cloudinaryApi:import.meta.env.VITE_CLOUDINARY_API_KEY,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

export default conf;
