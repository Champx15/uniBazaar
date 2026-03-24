package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/cloudinary")
public class CloudinaryController {
    @Autowired private CloudinaryService cloudinaryService;

    @GetMapping("/signature/{type}")
    public Map<String, Object> getSignature(@PathVariable String type) {
        String folder;
        if(type.equals("profile"))  folder = "home/uniBazaar/profile_images";
        else if(type.equals("listing")) folder = "home/uniBazaar/listing_images";
        else folder = "home/uniBazaar/id_cards";
        return cloudinaryService.getUploadSignature(folder);
    }
}

