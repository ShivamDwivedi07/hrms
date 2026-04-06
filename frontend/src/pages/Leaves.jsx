import { useEffect, useState } from "react";
import { getLeaves, applyLeave, approveLeave, rejectLeave } from "../api";
import toast from "react-hot-toast";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee_id: "",
    leave_type: "sick",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const load = () => getLeaves().then((r) => setLeaves(r.data));
  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await applyLeave({ ...form, employee_id: parseInt(form.employee_id) });
    toast.success("Leave applied!");
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          + Apply Leave
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Apply for Leave</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Employee ID</label>
              <input
                value={form.employee_id}
                onChange={(e) =>
                  setForm({ ...form, employee_id: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Leave Type</label>
              <select
                value={form.leave_type}
                onChange={(e) =>
                  setForm({ ...form, leave_type: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                {["sick", "casual", "earned", "WFH"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={2}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={submit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Submit
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "Emp ID",
                "Type",
                "From",
                "To",
                "Reason",
                "Status",
                "AI Flag",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaves.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{l.employee_id}</td>
                <td className="px-4 py-3 capitalize">{l.leave_type}</td>
                <td className="px-4 py-3">{l.start_date}</td>
                <td className="px-4 py-3">{l.end_date}</td>
                <td className="px-4 py-3 max-w-xs truncate">{l.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      l.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : l.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {l.status}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-xs text-orange-600 max-w-xs truncate"
                  title={l.ai_flag}>
                  {l.ai_flag?.slice(0, 60) || "—"}
                </td>
                <td className="px-4 py-3">
                  {l.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          approveLeave(l.id, "").then(load);
                          toast.success("Approved");
                        }}
                        className="text-green-600 hover:text-green-800 text-xs font-medium">
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          rejectLeave(l.id, "").then(load);
                          toast.error("Rejected");
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No leave requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
