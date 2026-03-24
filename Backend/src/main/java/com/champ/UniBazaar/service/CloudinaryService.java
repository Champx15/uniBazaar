package com.champ.UniBazaar.service;

import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhgexldfr",
                "api_key", "475849914374782",
                "api_secret", "PuoD3m_4RtduNGntMAXlMtlQgWk"
        ));
    }
    //TODO: secure this
//    public CloudinaryService() {
//        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
//                "cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"),
//                "api_key", System.getenv("CLOUDINARY_API_KEY"),
//                "api_secret", System.getenv("CLOUDINARY_API_SECRET")
//        ));
//    }

    public Map<String, Object> getUploadSignature(String folder) {
        long timestamp = System.currentTimeMillis() / 1000; // seconds

        Map<String, Object> params = ObjectUtils.asMap(
                "folder", folder,
                "timestamp", timestamp
        );

        String signature = cloudinary.apiSignRequest(params, "PuoD3m_4RtduNGntMAXlMtlQgWk");
//        String signature = cloudinary.apiSignRequest(params, System.getenv("CLOUDINARY_API_SECRET"));

        return ObjectUtils.asMap(
                "signature", signature,
                "timestamp", timestamp,
                "folder", folder
        );
    }

}