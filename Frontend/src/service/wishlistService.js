import conf from "../conf/conf";
export class WishlistService{

    async getWishlists(){
        const res = await fetch(`${conf.apiBase}/wishlist`, {
            method: "GET",
            credentials:"include"
        });
        if (!res.ok) throw new Error("Failed to get wishlists");
        return await res.json();
    }

    async addWishlist({listingId}){
        const res = await fetch(`${conf.apiBase}/wishlist/${listingId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include"
        });
        if (!res.ok) throw new Error("Failed to add wishlist");
        return true;
    }

    async removeWishlist({listingId}){
        const res = await fetch(`${conf.apiBase}/wishlist/${listingId}`, {
            method: "DELETE",
            credentials:"include"
            
        });
        if (!res.ok) throw new Error("Failed to remove wishlist");
        return true;
    }

}
const wishlistService = new WishlistService();
export default wishlistService;