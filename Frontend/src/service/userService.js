import conf from "../conf/conf";
import cloudinaryService from "./cloudinaryService";
export class UserService {
  async getCurrentUser() {
    const res = await fetch(`${conf.apiBase}/user`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to get current user");
    return await res.json();
  }

  async deleteUser() {
    const res = await fetch(`${conf.apiBase}/user`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error while deleting user");
    return true;
  }

  async editUser({ name, pfImage }) {
    let pfImageUrl = null;
    if (pfImage && pfImage instanceof File) {
      const { signature, timestamp, folder } =
        await cloudinaryService.getSignature({ type: "profile" });
      const formData = new FormData();
      formData.append("file", pfImage);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", conf.cloudinaryApi);
      formData.append("folder", folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!cloudinaryRes.ok) {
        const err = await cloudinaryRes.json();
        console.log(err);
        throw new Error(err.error?.message || "Image upload failed");
      }

      const cloudinaryData = await cloudinaryRes.json();
      pfImageUrl = cloudinaryData.secure_url;
    }
    const res = await fetch(`${conf.apiBase}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, pfImageUrl }),
    });

    if (!res.ok) throw new Error("Failed to edit user");
    return true;
  }

  async uploadIdCard({idCard, enrollmentNo}) {
    const { signature, timestamp, folder } = await cloudinaryService.getSignature({ type: "id_cards" });
    const formData = new FormData();
    formData.append("file", idCard);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("api_key", conf.cloudinaryApi);
    formData.append("folder", folder);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!cloudinaryRes.ok) {
      const err = await cloudinaryRes.json();
      console.log(err);
      throw new Error(err.error?.message || "ID card upload failed");
    }

    const cloudinaryData = await cloudinaryRes.json();
    const idCardUrl = cloudinaryData.secure_url;

    const res = await fetch(`${conf.apiBase}/id-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idCardUrl, enrollmentNo }),
    });

    if (!res.ok) throw new Error("Failed to upload ID card");
    return true;
  }

  async feedback({feedback}) {
    const res = await fetch(`${conf.apiBase}/user/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ feedback }),
    });

    if (!res.ok) throw new Error("Failed to submit feedback");
    return true;
  }
}
const userService = new UserService();
export default userService;
