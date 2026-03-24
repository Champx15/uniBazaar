package com.champ.UniBazaar.service;


import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
@Service
public class OAuthService {

    private static Environment env;

    public OAuthService(Environment environment) {
        OAuthService.env = environment;
    }

    public static Credential authorize() throws IOException {

        // Load from environment variables
        String clientId = env.getProperty("CLIENT_ID");
        String clientSecret = env.getProperty("CLIENT_SECRET");
        String refreshToken =env.getProperty("REFRESH_TOKEN");

        // ✅ Build a credential directly from the refresh token
        GoogleCredential credential = new GoogleCredential.Builder()
                .setClientSecrets(clientId, clientSecret)
                .setTransport(new NetHttpTransport())
                .setJsonFactory(GsonFactory.getDefaultInstance())
                .build()
                .setRefreshToken(refreshToken);

        // Refresh access token before use
        credential.refreshToken();
        String accessToken = credential.getAccessToken();



        return credential;
    }
}
