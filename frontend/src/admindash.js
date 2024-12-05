import React, { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/solid";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid";

const data = [
  { date: "01", thisMonth: 4, lastMonth: 3 },
  { date: "02", thisMonth: 5, lastMonth: 4 },
  { date: "03", thisMonth: 7, lastMonth: 6 },
  { date: "04", thisMonth: 6, lastMonth: 5 },
];

const people = [
  { name: "John Doe", image: "https://via.placeholder.com/150" },
  { name: "Jane Smith", image: "https://via.placeholder.com/150" },
  { name: "Alice Johnson", image: "https://via.placeholder.com/150" },
  { name: "Bob Brown", image: "https://via.placeholder.com/150" },
];

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full fixed top-4 right-4"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>

      <div className=" dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 bg-[#3D3BF3] ">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-white ">Admin Dashboard</h1>
          </motion.div>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" shadow-md rounded-lg p-4 flex items-center space-x-4 bg-[#EBEAFF]"
          >
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-500">Finished</p>
              <h2 className="text-2xl font-bold">18</h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=" shadow-md rounded-lg p-4 flex items-center space-x-4 bg-[#EBEAFF]"
          >
            <ClockIcon className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-gray-500">Tracked</p>
              <h2 className="text-2xl font-bold">31h</h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className=" shadow-md rounded-lg p-4 flex items-center space-x-4 bg-[#EBEAFF]"
          >
            <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-500">Efficiency</p>
              <h2 className="text-2xl font-bold">93%</h2>
            </div>
          </motion.div>
        </section>
        {/* Added People Section */}
        <section className="bg-[#EBEAFF] shadow-md rounded-lg p-6 mt-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Added People</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {people.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md"
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-bold">{person.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Performance Graph */}
        <section className=" shadow-md rounded-lg p-6 mb-6 bg-[#EBEAFF]">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ccc",
                  }}
                  labelStyle={{ color: "#333" }}
                  formatter={(value, name) => [`${value} hours`, name]}
                />
                <Line
                  type="monotone"
                  dataKey="thisMonth"
                  stroke="#8884d8"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="lastMonth"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Current Tasks with Progress */}
        <section className="bg-[#EBEAFF] shadow-md rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Current Tasks
          </h3>
          <div className="mb-4">
            <p className="text-gray-700">Product Review for UI8 Market</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
