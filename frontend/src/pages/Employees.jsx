import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  deactivateEmployee,
  exportCSV,
} from "../api";
import toast from "react-hot-toast";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    joining_date: "",
    manager: "",
    contact: "",
    skills: "",
  });

  const load = async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      await createEmployee(form);
      toast.success("Employee added! AI bio generated.");
      setShowForm(false);
      setForm({
        name: "",
        email: "",
        designation: "",
        department: "",
        joining_date: "",
        manager: "",
        contact: "",
        skills: "",
      });
      load();
    } catch {
      toast.error("Failed to add employee");
    }
    setLoading(false);
  };

  const deactivate = async (id) => {
    await deactivateEmployee(id);
    toast.success("Employee deactivated");
    load();
  };

  const downloadCSV = async () => {
    const res = await exportCSV();
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-1">
            AI auto-generates bio on creation
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            + Add Employee
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">New Employee</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              "name",
              "email",
              "designation",
              "department",
              "joining_date",
              "manager",
              "contact",
              "skills",
            ].map((field) => (
              <div key={field}>
                <label className="text-xs text-gray-500 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type={field === "joining_date" ? "date" : "text"}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">
              {loading ? "Creating + Generating Bio..." : "Create Employee"}
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
                "Name",
                "Email",
                "Department",
                "Designation",
                "Status",
                "Bio",
                "Action",
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
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {e.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{e.email}</td>
                <td className="px-4 py-3 text-gray-600">{e.department}</td>
                <td className="px-4 py-3 text-gray-600">{e.designation}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {e.status}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-gray-500 max-w-xs truncate"
                  title={e.bio}>
                  {e.bio || "—"}
                </td>
                <td className="px-4 py-3">
                  {e.status === "active" && (
                    <button
                      onClick={() => deactivate(e.id)}
                      className="text-red-500 hover:text-red-700 text-xs">
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No employees yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
