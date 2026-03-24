import conf from "../conf/conf";
import cloudinaryService from "./cloudinaryService";
export class ListingService {
  async createListing({ title, description, price, images, tags }) {
    //get signature from backend
    const { signature, timestamp, folder } =
      await cloudinaryService.getSignature({ type: "listing" });
    // Upload all images in parallel
    const uploadPromises = images.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature); // ✅ Signed token
      formData.append("timestamp", timestamp); // ✅ Timestamp
      formData.append("api_key", conf.cloudinaryApi); // ✅ Public API key
      formData.append("folder", folder);
      // formData.append("upload_preset", conf.uploadPreset);

      return fetch(
        `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => data.secure_url)
        .catch((err) => {
          console.error("Error uploading image:", err);
          throw err;
        });
    });

    // Wait for all uploads to finish
    const imageUrls = await Promise.all(uploadPromises);

    //send to backend
    const res = await fetch(`${conf.apiBase}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title, description, price, imageUrls, tags }),
    });

    if (!res.ok) throw new Error("Failed to create listing");
    return await res.json();
  }

  async getListingById({ id }) {
    const res = await fetch(`${conf.apiBase}/listings/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to get listing");
    return await res.json();
  }

  async getUserListings() {
    const res = await fetch(`${conf.apiBase}/listings/user`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to get user listings");
    return await res.json();
  }

  async getAllListings({ cursorId, cursorCreatedAt }) {
    const res = await fetch(
      `${conf.apiBase}/listings?cursorId=${cursorId}&cursorCreatedAt=${cursorCreatedAt}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Failed to get all listings");
    const data = await res.json();
    // Backend returns PagedResponse with content, page, size, totalElements, totalPages
    return data;
  }

  async removeListing({ id }) {
    const res = await fetch(`${conf.apiBase}/listings/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to remove listing");
    return true;
  }

  async updateListing({
    id,
    title,
    description,
    price,
    images = [],
    imageUrls,
    tags,
  }) {
    let finalImageUrls = [];

    // ✅ Only upload images if new images are provided
    if (images && images.length > 0) {
      const { signature, timestamp, folder } =
        await cloudinaryService.getSignature({ type: "listing" });

      const uploadPromises = images.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp);
        formData.append("api_key", conf.cloudinaryApi);
        formData.append("folder", folder);

        return fetch(
          `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        )
          .then((res) => res.json())
          .then((data) => data.secure_url)
          .catch((err) => {
            console.error("Error uploading image:", err);
            throw err;
          });
      });

      // Wait for all uploads to finish
      const newImageUrls = await Promise.all(uploadPromises);

      // Combine existing URLs with newly uploaded URLs
      finalImageUrls = [...(imageUrls || []), ...newImageUrls];
    } else if (imageUrls) {
      // If no new images, just use the existing imageUrls
      finalImageUrls = imageUrls;
    }

    // ✅ Build payload with only changed fields
    const payload = {};
    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (price !== undefined) payload.price = price;
    if (finalImageUrls.length > 0) payload.imageUrls = finalImageUrls;
    if (tags !== undefined) payload.tags = tags;

    // Send to backend
    const res = await fetch(`${conf.apiBase}/listings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update listing");
    return await res.json();
  }

  async updateAvailability({ id, status }) {
    const res = await fetch(
      `${conf.apiBase}/listings/availability/${id}?status=${status}`,
      {
        method: "PATCH",
        credentials: "include",
      },
    );

    if (!res.ok) throw new Error("Failed to update listing availability");
    return true;
  }

  async search({ query }) {
    const res = await fetch(`${conf.apiBase}/listings/search?title=${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to search listings");
    return await res.json();
  }

  async filter({ minPrice, maxPrice, condition, department }) {
    const params = new URLSearchParams();
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    if (condition) params.append("condition", condition);
    if (department) params.append("department", department);

    const res = await fetch(
      `${conf.apiBase}/listings/filter?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Failed to filter listings");
    return await res.json();
  }
}
const listingService = new ListingService();
export default listingService;
