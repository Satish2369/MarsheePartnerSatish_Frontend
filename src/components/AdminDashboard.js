
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";

const AdminDashboard = () => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error,setError] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(BASE_URL + "/admin/accounts", {
        withCredentials: true,
      });

      if (res.data.success) {
        setAllAccounts(res.data.data);
        setFilteredAccounts(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const filtered = allAccounts.filter(
      (acc) =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search accounts by name or email"
        className="p-2 border border-gray-300 rounded w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && <p className="text-red-400 texl-[30px] text-center">{error}</p>}

      {filteredAccounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredAccounts.map((acc) => (
            <li
              key={acc._id}
              className="bg-white p-4 rounded shadow flex flex-col gap-1"
            >
              <span className="font-semibold text-lg">{acc.name}</span>
              <span className="text-gray-600">{acc.email}</span>
              <span className="text-sm text-gray-400">Role: {acc.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
