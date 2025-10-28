import React, { useEffect, useState } from "react";
import ChatWindow from "../../components/ChatWindow";
import api from "../../api/axiosInstance";

export default function ChatWithAdmin() {
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    // Find admin user ID
    const findAdmin = async () => {
      try {
        const res = await api.get("/api/admin/users");
        const admin = res.data.find(u => u.role === "ADMIN");
        if (admin) {
          setAdminId(admin.id);
        }
      } catch (err) {
        console.error("Failed to find admin", err);
      }
    };
    findAdmin();
  }, []);

  if (!adminId) {
    return <div className="p-4">Finding admin...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ChatWindow
        receiverId={adminId}
        receiverName="Admin Support"
        onClose={() => window.history.back()}
      />
    </div>
  );
}