import conf from "../conf/conf"

export class CloudinaryService {

    async getSignature({type}){
        try{
            const res = await fetch(`${conf.apiBase}/cloudinary/signature/${type}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:"include",
            });
            return await res.json();
        }catch(error){
            console.error("Error getting cloudinary signature:", error);
        }
    }
}
const cloudinaryService = new CloudinaryService();
export default cloudinaryService;