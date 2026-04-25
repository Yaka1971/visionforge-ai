import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, LogOut, ArrowLeft, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to view your profile</p>
          <Button onClick={() => setLocation("/")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      toast.success("Logged out successfully");
      setLocation("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <User className="text-blue-500" size={32} />
              My Profile
            </h1>
            <p className="text-gray-400">Manage your VisionForge AI account</p>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-slate-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 border-slate-700/50 p-8">
            {/* User Avatar */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">
                  Full Name
                </label>
                <p className="text-lg text-white">{user.name || "Not provided"}</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <p className="text-lg text-white">{user.email || "Not provided"}</p>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">
                  Account Type
                </label>
                <div className="inline-block">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      user.role === "admin"
                        ? "bg-purple-600/20 text-purple-300"
                        : "bg-blue-600/20 text-blue-300"
                    }`}
                  >
                    {user.role === "admin" ? "Administrator" : "User"}
                  </span>
                </div>
              </div>

              {/* Join Date */}
              <div>
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  Member Since
                </label>
                <p className="text-lg text-white">{joinDate}</p>
              </div>

              {/* Login Method */}
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">
                  Login Method
                </label>
                <p className="text-lg text-white capitalize">
                  {user.loginMethod || "Manus OAuth"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
              >
                <LogOut size={18} className="mr-2" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-blue-600/10 border-blue-500/30 p-6">
            <p className="text-blue-200">
              <strong>Note:</strong> Your profile information is managed by your Manus account.
              To update your details, please visit your Manus account settings.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
