package com.champ.UniBazaar.service;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;
import java.util.Properties;

public class GmailService {

    private static final String API_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

    //EmailHtml
    public static MimeMessage createEmailHtml(String to, String from, String subject, String htmlBody, String textFallback)
            throws MessagingException {

        Properties props = System.getProperties();
        Session session = Session.getInstance(props);
        MimeMessage email = new MimeMessage(session);

        email.setFrom(new InternetAddress(from));
        email.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        email.setSubject(subject);

        // Plain-text fallback (for clients that can't render HTML)
        MimeBodyPart textPart = new MimeBodyPart();
        textPart.setText(textFallback, "UTF-8");

        // HTML body
        MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(htmlBody, "text/html; charset=UTF-8");

        // Combine both into multipart/alternative (best practice)
        MimeMultipart multipart = new MimeMultipart("alternative");
        multipart.addBodyPart(textPart);
        multipart.addBodyPart(htmlPart);

        email.setContent(multipart);

        return email;
    }

    // ✅ Encode MIME email to Base64 (URL-safe, no padding)
    public static String encodeEmailToBase64(MimeMessage emailContent)
            throws MessagingException, java.io.IOException {

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        emailContent.writeTo(byteArrayOutputStream);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(byteArrayOutputStream.toByteArray());
    }

    // ✅ Send email via Gmail API
    public static void sendEmail(String accessToken, String to, String from, String subject, String htmlBody) {
        try {
            MimeMessage email = createEmailHtml(to, from, subject, htmlBody, "Please view this email in HTML mode.");
            String rawEmail = encodeEmailToBase64(email);

            WebClient webClient = WebClient.builder()
                    .baseUrl("https://gmail.googleapis.com")
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .build();

            Map<String, String> bodyValue = Collections.singletonMap("raw", rawEmail);

            String response = webClient.post()
                    .uri("/gmail/v1/users/me/messages/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(bodyValue)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();


        } catch (Exception e) {
            System.err.println("❌ Failed to send email:");
            e.printStackTrace();
        }
    }
}
