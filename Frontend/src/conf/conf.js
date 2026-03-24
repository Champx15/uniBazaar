const conf = {
  // apiBase: import.meta.env.VITE_API_BASE_URL,
  apiBase: `${window.location.protocol}//${window.location.hostname}:8080/api/v1`,
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  cloudinaryApi:import.meta.env.VITE_CLOUDINARY_API_KEY
};

export default conf;
