import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Employees from "./pages/Employees";
import Recruitment from "./pages/Recruitment";
import Leaves from "./pages/Leaves";
import Performance from "./pages/Performance";
import Onboarding from "./pages/Onboarding";
import Analytics from "./pages/Analytics";

const nav = [
  { path: "/", label: "Employees", icon: "👥" },
  { path: "/recruitment", label: "Recruitment", icon: "📋" },
  { path: "/leaves", label: "Leaves", icon: "🗓️" },
  { path: "/performance", label: "Performance", icon: "⭐" },
  { path: "/onboarding", label: "Onboarding", icon: "🚀" },
  { path: "/analytics", label: "Analytics", icon: "📊" },
];

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-gray-50 font-sans">
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">AI HRMS</h1>
            <p className="text-xs text-gray-400 mt-0.5">Powered by Groq</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {nav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }>
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Employees />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
