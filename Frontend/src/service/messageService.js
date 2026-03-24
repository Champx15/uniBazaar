import conf from "../conf/conf";
export class MessageService {

  async getInbox() {
    const res = await fetch(conf.apiBase + "/messages", {
        credentials:"include"
    });
    if (!res.ok) throw new Error("Failed to fetch inbox");
    return res.json();
  }

  async sendMessage({senderId, recipient, message}) {
    const res = await fetch(conf.apiBase + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify({senderId, receiverId: recipient, message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
  }

  async getMessage({otherUserId}) {
    const res = await fetch(conf.apiBase + `/messages/${otherUserId}`, {
      credentials:"include"
    });
    if (!res.ok) throw new Error("Failed to fetch message");
    return res.json();
  }

  async markAsRead({userId,conversationId}){
    const res = await fetch(conf.apiBase + `/messages/mark-read?userId=${userId}&conversationId=${conversationId}`, {
      method: "POST",
      credentials:"include"
    });
    if (!res.ok) throw new Error("Failed to mark message as read");
  }

}
const messageService = new MessageService();
export default messageService;
