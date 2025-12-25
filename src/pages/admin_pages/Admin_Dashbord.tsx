import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  Users,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react"; // 💡 අවශ්‍ය Icons

// Dummy Data (අපිට සත්‍ය API calls වලින් මෙය ලබා ගත හැක)
const dashboardMetrics = [
  {
    title: "Total Registered Users",
    value: "4,521",
    icon: Users,
    color: "bg-blue-600",
    trend: "+5.1%",
    description: "Since last month",
  },
  {
    title: "Active Events",
    value: "128",
    icon: Calendar,
    color: "bg-green-600",
    trend: "+12%",
    description: "Upcoming & Ongoing",
  },
  {
    title: "Pending Organizer Requests",
    value: "14",
    icon: Clock,
    color: "bg-yellow-600",
    trend: "-2.3%",
    description: "Needs Review",
  },
  {
    title: "Total Revenue (Simulated)",
    value: "$145K",
    icon: DollarSign,
    color: "bg-indigo-600",
    trend: "+8.9%",
    description: "Year to date",
  },
];

const AdminDashboard = () => {
  // 💡 Auth Context එකෙන් user details ලබා ගැනීම
  const { user } = useAuth();

  // 💡 මෙහිදී ඔබට API calls මගින් සත්‍ය දත්ත load කළ හැක
  // useEffect(() => { /* Fetch data logic */ }, []);

  return (
    // mt-16 යනු Sidebar එකේ උඩ කොටසට ඉඩ දීම සඳහාය (Sidebar එක fixed නම්)
    <div className="pt-8 pb-10 px-6 sm:px-10 min-h-screen bg-gray-50">
      {/* --- Dashboard Header --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || "Admin"}
        </h1>
        <p className="text-gray-600 mt-1">
          Overview of system statistics and management links.
        </p>
      </div>

      {/* --- 1. Metric Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {dashboardMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {metric.title}
                </p>
                <div className={`p-2 rounded-full text-white ${metric.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-4xl font-extrabold text-gray-900">
                  {metric.value}
                </p>
              </div>

              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="font-semibold text-green-500 mr-2">
                  {metric.trend}
                </span>
                <span className="text-gray-500">{metric.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- 2. Main Content Grid (Charts and Tables) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart/Graph Area (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Event Registration Trends
          </h2>
          <div className="h-80 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {/* 💡 මෙහිදී ඔබට Chart Component එකක් (e.g., Recharts, Chart.js) එකතු කළ හැක */}
            <BarChart3 className="w-8 h-8 mr-2" /> Chart Placeholder
          </div>
        </div>

        {/* Recent Activity/Log (1/3 width) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent System Activity
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center text-sm text-gray-700">
              <span>New organizer registered (TechCo)</span>
              <span className="text-gray-500 text-xs">5 mins ago</span>
            </li>
            <li className="flex justify-between items-center text-sm text-gray-700">
              <span>Event 'Music Fest' updated</span>
              <span className="text-gray-500 text-xs">1 hour ago</span>
            </li>
            <li className="flex justify-between items-center text-sm text-gray-700">
              <span>User 'Dusan' logged in</span>
              <span className="text-gray-500 text-xs">3 hours ago</span>
            </li>
            {/* ... more activities */}
          </ul>
          <button className="mt-6 w-full text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
