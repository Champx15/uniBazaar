package com.champ.UniBazaar.service;

import com.google.api.client.auth.oauth2.Credential;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    public void sendVerifyEmail(String to, String otp) throws Exception {

        String htmlContent = """
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #ffffff;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                      }
                      .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 30px 30px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                      }
                      h2 {
                        font-size: 26px;
                        font-weight: bold;
                        margin-bottom: 15px;
                      }
                      p {
                        font-size: 15px;
                        color: #555555;
                        margin: 10px 0;
                      }
                      .otp-box {
                        display: inline-block;
                        background-color: #f9f9f9;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 15px 25px;
                        font-size: 24px;
                        font-weight: bold;
                        color: #d93025;
                        letter-spacing: 4px;
                        margin: 25px 0;
                      }
                      a {
                        color: #10a37f;
                        text-decoration: none;
                      }
                      .footer {
                        font-size: 12px;
                        color: gray;
                        margin-top: 25px;
                      }
                      @media (prefers-color-scheme: dark) {
                        body {
                          background-color: #121212;
                          color: #e0e0e0;
                        }
                        .container {
                          background-color: #1e1e1e;
                          border-color: #333;
                        }
                        .otp-box {
                          background-color: #2c2c2c;
                          border-color: #444;
                          color: #ff6b6b;
                        }
                        a {
                          color: #58d3a0;
                        }
                        .footer {
                          color: #aaaaaa;
                        }
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h3>Verify your email address</h3>
                      <p>To continue setting up your UniBazaar account, please enter and verify the given otp.</p>
                      <div class="otp-box">%s</div>
                      <p >This code will expire after 5 minutes. If you did not make this request, please disregard this email.</p>
                      <p class="footer">&copy; 2025 UniBazaar. All rights reserved.</p>
                    </div>
                  </body>
                </html>
                """.formatted(otp);

        String plainText = "Your OTP code for UniBazaar is: " + otp;

        // 2️⃣ Authorize Gmail (headless mode if on Render)
        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        // 3️⃣ Create the HTML email using GmailService
        MimeMessage email = GmailService.createEmailHtml(to, "me", "Verify your UniBazaar account", htmlContent, plainText);

        // 4️⃣ Send email via Gmail API
        GmailService.sendEmail(accessToken, to, "me", "Verify your UniBazaar account", htmlContent);

    }

    public void sendForgotEmail(String to, String otp) throws Exception {

        String htmlContent = """
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #ffffff;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                      }
                      .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 30px 30px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                      }
                      h2 {
                        font-size: 26px;
                        font-weight: bold;
                        margin-bottom: 15px;
                      }
                      p {
                        font-size: 15px;
                        color: #555555;
                        margin: 10px 0;
                      }
                      .otp-box {
                        display: inline-block;
                        background-color: #f9f9f9;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 15px 25px;
                        font-size: 24px;
                        font-weight: bold;
                        color: #d93025;
                        letter-spacing: 4px;
                        margin: 25px 0;
                      }
                      a {
                        color: #10a37f;
                        text-decoration: none;
                      }
                      .footer {
                        font-size: 12px;
                        color: gray;
                        margin-top: 25px;
                      }
                      @media (prefers-color-scheme: dark) {
                        body {
                          background-color: #121212;
                          color: #e0e0e0;
                        }
                        .container {
                          background-color: #1e1e1e;
                          border-color: #333;
                        }
                        .otp-box {
                          background-color: #2c2c2c;
                          border-color: #444;
                          color: #ff6b6b;
                        }
                        a {
                          color: #58d3a0;
                        }
                        .footer {
                          color: #aaaaaa;
                        }
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h3>Reset your account password</h3>
                      <p>To change your UniBazaar account password, please enter and verify the given otp.</p>
                      <div class="otp-box">%s</div>
                      <p >This code will expire after 5 minutes. If you did not make this request, please disregard this email.</p>
                      <p class="footer">&copy; 2025 UniBazaar. All rights reserved.</p>
                    </div>
                  </body>
                </html>
                """.formatted(otp);

        String plainText = "Your OTP code for resetting UniBazaar account is: " + otp;

        // 2️⃣ Authorize Gmail (headless mode if on Render)
        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        // 3️⃣ Create the HTML email using GmailService
        MimeMessage email = GmailService.createEmailHtml(to, "me", "Reset UniBazaar Account Password", htmlContent, plainText);

        // 4️⃣ Send email via Gmail API
        GmailService.sendEmail(accessToken, to, "me", "Reset UniBazaar Account Password", htmlContent);

    }

    public void sendAccountBlockedEmail(String to, String userName) throws Exception {

        String htmlContent = """
                <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Suspended</title>
                </head>
                <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
                <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:10px 0;">
                <tr>
                <td align="center">
                <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:30px;max-width:600px;">
                <tr>
                <td style="font-size:15px;color:#333;line-height:1.6;">
                <p>Hello <strong>%s</strong>,</p>
                <p>
                We recently detected activity on your UniBazaar account that may not comply with our marketplace guidelines.
                As a precaution, your account has been temporarily suspended.
                </p>
                </td>
                </tr>
                <tr>
                <td style="padding-top:15px;background:#fff4e5;border-left:4px solid #d93025;padding:16px;font-size:14px;line-height:1.6;">
                <strong>Why did this happen?</strong><br><br>
                Your account may have been flagged due to unusual activity, reported listings, or actions that appear to violate our community rules.
                These measures help keep UniBazaar safe and trustworthy for everyone.
                </td>
                </tr>
                <tr>
                <td align="center" style="padding:32px 0;">
                <a href="mailto:support.unibazaar@protonmail.com?subject=Account Suspension Appeal"
                style="background:#d93025;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:5px;font-size:14px;font-weight:bold;">
                Contact Support
                </a>
                </td>
                </tr>
                <tr>
                <td style="font-size:14px;color:#333;line-height:1.6;">
                <strong>Think this was a mistake?</strong>
                <p style="margin-top:6px;">
                You can request a review by emailing our support team. Please include:
                </p>
                <ul style="padding-left:20px;">
                <li>A short explanation of the situation</li>
                <li>Any information that might help our team review your case</li>
                </ul>
                </td>
                </tr>
                <tr>
                <td style="padding-top:30px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                <strong>UniBazaar Support</strong><br>
                support.unibazaar@protonmail.com<br>
                Typical response time: 24–48 hours<br><br>
                © 2025 UniBazaar
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>
                """.formatted(userName);

        String plainText = "Dear " + userName + ", Your UniBazaar account has been suspended. Please contact support.unibazaar@protonmail.com for more information.";

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(accessToken, to, "me", "Your UniBazaar Account Has Been Suspended", htmlContent);
    }

    public void sendAppealRejected(String to, String userName) throws Exception {

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Appeal Decision</title>
                </head>
                
                <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
                
                <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:10px 0;">
                <tr>
                <td align="center">
                
                <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:30px;max-width:600px;">
                
                <tr>
                <td style="font-size:15px;color:#333;line-height:1.6;">
                
                <p>Hello <strong>%s</strong>,</p>
                
                <p>
                Thank you for contacting UniBazaar support regarding your account suspension.
                Our team has carefully reviewed your appeal and the activity associated with your account.
                </p>
                
                <p>
                After completing our review, we regret to inform you that the suspension of your account will remain in place.
                This decision was made because the activity on the account was found to be in violation of our marketplace guidelines.
                </p>
                
                </td>
                </tr>
                
                <tr>
                <td style="padding-top:15px;background:#fff4e5;border-left:4px solid #d93025;padding:16px;font-size:14px;line-height:1.6;">
                <strong>What this means</strong><br><br>
                Your account will remain suspended and access to posting listings, purchasing items, and messaging users will continue to be restricted.
                </td>
                </tr>
                
                <tr>
                <td style="font-size:14px;color:#333;line-height:1.6;padding-top:15px;">
                If you have additional information that may help clarify the situation, you may still contact our support team.
                </td>
                </tr>
                
                <tr>
                <td align="center" style="padding:32px 0;">
                <a href="mailto:support.unibazaar@protonmail.com"
                style="background:#d93025;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:5px;font-size:14px;font-weight:bold;">
                Contact Support
                </a>
                </td>
                </tr>
                
                <tr>
                <td style="padding-top:30px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                
                <strong>UniBazaar Support</strong><br>
                support.unibazaar@protonmail.com<br>
                Typical response time: 24–48 hours<br><br>
                
                © 2025 UniBazaar
                
                </td>
                </tr>
                
                </table>
                
                </td>
                </tr>
                </table>
                
                </body>
                </html>
                """.formatted(userName);

        String plainText = "Dear " + userName + ", your appeal has been reviewed but the suspension of your UniBazaar account will remain in place. Please contact support.unibazaar@protonmail.com for more information.";

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(accessToken, to, "me", "Update on Your UniBazaar Appeal", htmlContent);
    }

    public void sendAppealAccepted(String to, String userName) throws Exception {

        String htmlContent = """
                        <!DOCTYPE html>
                                <html>
                                <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Account Restored</title>
                                </head>
                                <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
                                <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:10px 0;">
                                <tr>
                                <td align="center">
                                <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:30px;max-width:600px;">
                                <tr>
                                <td style="font-size:15px;color:#333;line-height:1.6;">
                                <p>Hello <strong>%s</strong>,</p>
                                <p>
                                Thank you for contacting UniBazaar support regarding your account suspension.
                                Our team has reviewed your appeal and the details you provided.
                                </p>
                                <p>
                                We are happy to inform you that your appeal has been accepted and your account access has now been restored.
                                </p>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding-top:15px;background:#e6f4ea;border-left:4px solid #34a853;padding:16px;font-size:14px;line-height:1.6;">
                                <strong>Account Status: Active</strong><br><br>
                                Your account is now fully accessible again. You can continue browsing, posting listings, purchasing items, and interacting with other users on UniBazaar.
                                </td>
                                </tr>
                                <tr>
                                <td style="font-size:14px;color:#333;line-height:1.6;padding-top:15px;">
                                We recommend reviewing our community guidelines to help ensure a safe and smooth experience for everyone on the platform.
                                </td>
                                </tr>
                                <tr>
                                <td align="center" style="padding:32px 0;">
                                <a href="mailto:support.unibazaar@protonmail.com"
                                style="background:#34a853;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:5px;font-size:14px;font-weight:bold;">
                                Contact Support
                                </a>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding-top:30px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                                <strong>UniBazaar Support</strong><br>
                                support.unibazaar@protonmail.com<br>
                                Typical response time: 24–48 hours<br><br>
                                © 2025 UniBazaar
                                </td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </table>
                                </body>
                                </html>
                """.formatted(userName);

        String plainText = "Dear " + userName + ", Your UniBazaar account has been suspended. Please contact support.unibazaar@protonmail.com for more information.";

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(accessToken, to, "me", "Your UniBazaar Account Has Been Suspended", htmlContent);
    }

    public void sendIdVerificationAccepted(String to, String userName) throws Exception {

        String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ID Verification Approved</title>
                    </head>
                
                    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
                
                    <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:10px 0;">
                    <tr>
                    <td align="center">
                
                    <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:30px;max-width:600px;">
                
                    <tr>
                    <td style="font-size:15px;color:#333;line-height:1.6;">
                
                    <p>Hello <strong>%s</strong>,</p>
                
                    <p>
                    Your ID verification has been successfully completed. Thank you for helping us keep UniBazaar a safe and trusted marketplace.
                    </p>
                
                    <p>
                    Your account is now fully verified.
                    </p>
                
                    </td>
                    </tr>
                
                    <tr>
                    <td style="padding-top:15px;background:#e6f4ea;border-left:4px solid #34a853;padding:16px;font-size:14px;line-height:1.6;">
                    <strong>Account Status: Verified</strong><br><br>
                    You can now chat with sellers, post listings, and make offers to other users on UniBazaar.
                    </td>
                    </tr>
                
                    <tr>
                    <td align="center" style="padding:32px 0;">
                    <a href="https://unibazaar.com"
                    style="background:#34a853;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:5px;font-size:14px;font-weight:bold;">
                    Go to UniBazaar
                    </a>
                    </td>
                    </tr>
                
                    <tr>
                    <td style="padding-top:30px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                    <strong>UniBazaar Support</strong><br>
                    support.unibazaar@protonmail.com<br>
                    Typical response time: 24–48 hours<br><br>
                    © 2025 UniBazaar
                    </td>
                    </tr>
                
                    </table>
                    </td>
                    </tr>
                    </table>
                
                    </body>
                    </html>
                """.formatted(userName);

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(accessToken, to, "me", "Your UniBazaar Account Has Been Verified", htmlContent);
    }

    public void sendIdVerificationRejected(String to, String userName) throws Exception {

        String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ID Verification Update</title>
                    </head>
                
                    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
                
                    <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:10px 0;">
                    <tr>
                    <td align="center">
                
                    <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:30px;max-width:600px;">
                
                    <tr>
                    <td style="font-size:15px;color:#333;line-height:1.6;">
                
                    <p>Hello <strong>%s</strong>,</p>
                
                    <p>
                    Thank you for submitting your ID verification for UniBazaar.
                    </p>
                
                    <p>
                    Unfortunately, we were unable to verify the document you submitted.
                    This may happen if the image is unclear or if the information could not be verified.
                    </p>
                
                    </td>
                    </tr>
                
                    <tr>
                    <td style="padding-top:15px;background:#fff4e5;border-left:4px solid #d93025;padding:16px;font-size:14px;line-height:1.6;">
                    <strong>What you can do</strong><br><br>
                    Please upload your ID again with a clear photo where all details are visible.
                    Make sure the document is not blurred, cropped, or partially hidden.
                    </td>
                    </tr>
                
                    <tr>
                    <td style="padding-top:30px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                    <strong>UniBazaar Support</strong><br>
                    support.unibazaar@protonmail.com<br>
                    Typical response time: 24–48 hours<br><br>
                    © 2025 UniBazaar
                    </td>
                    </tr>
                
                    </table>
                    </td>
                    </tr>
                    </table>
                
                    </body>
                    </html>
                """.formatted(userName);

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(accessToken, to, "me", "Your UniBazaar ID Verification Needs Attention", htmlContent);
    }


    public void sendListingBlockedEmail(
            String to,
            String userName,
            String listingTitle,
            String listingDescription,
            String listingPrice,
            String listingTags
    ) throws Exception {

        String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Listing Removed</title>
                    </head>
                
                    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
                
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
                    <tr>
                    <td align="center">
                
                    <table width="100%%" cellpadding="0" cellspacing="0"
                    style="max-width:600px;background:#ffffff;border-radius:8px;padding:30px;">
                
                    <tr>
                    <td style="font-size:15px;color:#333;line-height:1.6;">
                
                    <p>Hello <strong>%s</strong>,</p>
                
                    <p>
                    One of your listings on <strong>UniBazaar</strong> has been removed because it was found to violate our marketplace policies.
                    </p>
                
                    <p>
                    After careful review, this listing has been permanently removed from the platform.
                    </p>
                
                    </td>
                    </tr>
                
                    <!-- Listing Card -->
                
                    <tr>
                    <td style="padding-top:15px;">
                
                    <table width="100%%" cellpadding="0" cellspacing="0"
                    style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
                
                    <tr>
                    <td style="padding:16px;">
                
                    <h3 style="margin:0;color:#222;">%s</h3>
                
                    <p style="margin:10px 0;color:#555;font-size:14px;">
                    %s
                    </p>
                
                    <p style="margin:6px 0;font-size:14px;">
                    <strong>Price:</strong> %s
                    </p>
                
                    <p style="margin:6px 0;font-size:14px;">
                    <strong>Tags:</strong> %s
                    </p>
                
                    </td>
                    </tr>
                
                    </table>
                
                    </td>
                    </tr>
                
                    <tr>
                    <td style="padding-top:20px;font-size:14px;color:#333;line-height:1.6;">
                    Please ensure that future listings follow UniBazaar marketplace guidelines
                    to avoid further moderation actions.
                    </td>
                    </tr>
                
                    <tr>
                    <td style="padding-top:25px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                    <strong>UniBazaar Support</strong><br>
                    support.unibazaar@protonmail.com<br><br>
                    © 2025 UniBazaar
                    </td>
                    </tr>
                
                    </table>
                
                    </td>
                    </tr>
                    </table>
                
                    </body>
                    </html>
                """.formatted(
                userName,
                listingTitle,
                listingDescription,
                listingPrice,
                listingTags
        );

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(
                accessToken,
                to,
                "me",
                "Your UniBazaar Listing Has Been Removed",
                htmlContent
        );
    }

    public void sendFeedbackEmail(
            String userEmail,
            String userName,
            String feedbackContent
    ) throws Exception {

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Feedback from UniBazaar</title>
                </head>
            
                <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
            
                <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
                <tr>
                <td align="center">
            
                <table width="100%%" cellpadding="0" cellspacing="0"
                style="max-width:600px;background:#ffffff;border-radius:8px;padding:30px;">
            
                <tr>
                <td style="font-size:15px;color:#333;line-height:1.6;">
            
                <p><strong style="font-size:18px;color:#222;">New Feedback from UniBazaar</strong></p>
            
                </td>
                </tr>
            
                <!-- User Info Card -->
            
                <tr>
                <td style="padding-top:15px;">
            
                <table width="100%%" cellpadding="0" cellspacing="0"
                style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;background:#f9f9f9;">
            
                <tr>
                <td style="padding:16px;">
            
                <p style="margin:0 0 8px 0;color:#555;font-size:13px;">
                <strong>From:</strong> %s
                </p>
            
                <p style="margin:0;color:#555;font-size:13px;">
                <strong>Email:</strong> %s
                </p>
            
                </td>
                </tr>
            
                </table>
            
                </td>
                </tr>
            
                <!-- Feedback Content -->
            
                <tr>
                <td style="padding-top:20px;">
            
                <table width="100%%" cellpadding="0" cellspacing="0"
                style="border:1px solid #ddd;border-radius:8px;overflow:hidden;background:#fafafa;">
            
                <tr>
                <td style="padding:16px;">
            
                <p style="margin:0 0 10px 0;color:#222;font-weight:bold;font-size:14px;">Feedback:</p>
            
                <p style="margin:0;color:#333;font-size:14px;line-height:1.6;white-space:pre-wrap;">
                %s
                </p>
            
                </td>
                </tr>
            
                </table>
            
                </td>
                </tr>
            
                <tr>
                <td style="padding-top:25px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center;line-height:1.6;">
                <strong>UniBazaar Feedback System</strong><br>
                © 2025 UniBazaar
                </td>
                </tr>
            
                </table>
            
                </td>
                </tr>
                </table>
            
                </body>
                </html>
            """.formatted(
                userName,
                userEmail,
                feedbackContent
        );

        Credential credential = OAuthService.authorize();
        String accessToken = credential.getAccessToken();

        GmailService.sendEmail(
                accessToken,
                "support.unibazaar@protonmail.com",
                "me",
                "📝 New Feedback from " + userName,
                htmlContent
        );
    }

}