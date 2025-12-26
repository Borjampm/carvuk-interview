import { SignOutButton } from "@clerk/react-router";
import { useNavigate } from "react-router-dom";

export default function SignOutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Sign Out
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Are you sure you want to sign out?
        </p>
        <div className="flex flex-col gap-4">
          <SignOutButton redirectUrl="/">
            <button className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent">
              Yes, Sign Out
            </button>
          </SignOutButton>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

