import conf from "../conf/conf"

export class AuthService {


  async sendOTP({ email, enrollmentNo }) {
    try {
      const res = await fetch(`${conf.apiBase}/auth/signup/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,enrollmentNo }),
      });

      if (res.status === 409) {
        return { success: false, error: "User already exists" };
      } else if (!res.ok) {
        return { success: false, error: "Failed to send OTP" };
      }

      return { success: true };
    } catch (error) {
      console.log("Error: ", error);
      return { success: false, error: error.message };
    }
  }

  async verifySignup({ name, email, pass, otp, enrollmentNo }) {
    // let pfImageUrl = null;
    // // Upload image to Cloudinary if provided
    // if (pfImage && pfImage instanceof File) {
    //   const formData = new FormData();
    //   formData.append("file", pfImage);
    //   formData.append("upload_preset", conf.uploadPreset);

    //   const cloudinaryRes = await fetch(
    //     `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
    //     {
    //       method: "POST",
    //       body: formData,
    //     },
    //   );

    //   if (!cloudinaryRes.ok) {
    //     const err = await cloudinaryRes.json();
    //     console.log(err);
    //     throw new Error(err.error?.message || "Image upload failed");
    //   }

    //   const cloudinaryData = await cloudinaryRes.json();
    //   pfImageUrl = cloudinaryData.secure_url;
    // }
    //send data to backend
    try {
      let pfImageUrl = "";
      const res = await fetch(`${conf.apiBase}/auth/signup/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pass, pfImageUrl, otp, enrollmentNo }),
      });

      if (res.status === 201) {
        return { success: true };
      } else if (!res.ok) {
        return { success: false, error: "Signup verification failed" };
      }
      return { success: false, error: "Signup verification failed" };
    } catch (error) {
      console.log("Error: ", error);
      return { success: false, error: error.message };
    }
  }


  async login({ email, pass }) {
    try {
      const res = await fetch(`${conf.apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({ email, pass }),
      });
      const data = await res.json();

   if (!res.ok) {
      if (data.message === "BANNED") {
        throw new Error("Your account has been banned");
      } else if (data.message === "INVALID_CREDENTIALS") {
        throw new Error("Invalid email or password");
      } else {
        throw new Error(data.message || "Login failed");
      }
    }

      return data;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }

  async checkEmail({ email }) {
    try {
      const res = await fetch(`${conf.apiBase}/auth/login/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 404) {
        throw new Error("User with this email doesn't exist");
      } else if (!res.ok) {
        throw new Error("Failed to check email");
      }

      return { success: true };
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }

  async verifyOTP({ email, otp }) {
    try {
      const res = await fetch(`${conf.apiBase}/auth/login/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        throw new Error("Invalid OTP");
      }

      return { success: true };
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }

  async resetPassword({ newPass }) {
    try {
      const res = await fetch(`${conf.apiBase}/auth/login/reset-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPass }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset password");
      }

      return { success: true };
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }

  async logout() {
    fetch(`${conf.apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return true;
  }

}

const authService = new AuthService();
export default authService;
