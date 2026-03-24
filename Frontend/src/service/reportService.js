import conf from "../conf/conf";

export class ReportService{

    async report({type,id,reason,description}){

          try {
      const endpoint = type === "user" 
        ? `${conf.apiBase}/report/user/${id}`
        : `${conf.apiBase}/report/listing/${id}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, description }),
        credentials: "include"
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.message || "Failed to submit report" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error:", error);
      return { success: false, error: error.message };
    }
  }
}

const reportService = new ReportService();
export default reportService;
