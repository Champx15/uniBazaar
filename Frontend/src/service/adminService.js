import conf from "../conf/conf";

export class AdminService{

    async getStats(){
        const response = await fetch(`${conf.apiBase}/admin/stats`,
             { credentials: "include" });
        return await response.json();
    }

    async getListings(){
        const response = await fetch(`${conf.apiBase}/admin/listings`,
             { credentials: "include" });
        return await response.json();
    }

    async getReports(){
        const response = await fetch(`${conf.apiBase}/admin/reports`,
             { credentials: "include" });
        return await response.json();
    }

    async getIdCards(){
        const response = await fetch(`${conf.apiBase}/admin/id-cards`,
             { credentials: "include" });
        return await response.json();
    }

    async getUsers(){
        const response = await fetch(`${conf.apiBase}/admin/users`,
             { credentials: "include" });
        return await response.json();
    }

    async banUser(userId) {
        const response = await fetch(`${conf.apiBase}/admin/users/${userId}/ban`, {
            method: "PATCH",
            credentials: "include"
        });
        return true;
    }

    async unBanUser(userId){
        const response = await fetch(`${conf.apiBase}/admin/users/${userId}/unban`, {
            method: "PATCH",
            credentials: "include"
        });
        return true;
    }

    async blockListing(listingId){
        const response = await fetch(`${conf.apiBase}/admin/listings/${listingId}/block`, {
            method: "PATCH",
            credentials: "include"
        });
        return true;
    }

    async resolveReport(reportId, resolution,type,id){
        const response = await fetch(`${conf.apiBase}/admin/reports/${reportId}/resolve`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resolution, type, id }),
            credentials: "include"
        });
        return true;
    }

    async verifyIdCard(cardId,decision){
        const response = await fetch(`${conf.apiBase}/admin/id-cards/${cardId}/verify?decision=${decision}`, {
            method: "PATCH",
            credentials: "include"
        });
        return true;
    }

    async resolveAppeal(email,method){
        const response = await fetch(`${conf.apiBase}/admin/appeal/resolve`, {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({ email, method })
        });
        return true;
    }
}
const adminService = new AdminService();
export default adminService;