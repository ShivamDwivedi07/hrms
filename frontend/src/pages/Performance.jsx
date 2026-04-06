import { useEffect, useState } from "react";
import { getReviews, createReview, generateAIReview } from "../api";
import toast from "react-hot-toast";

export default function Performance() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    period: "",
    self_achievements: "",
    self_challenges: "",
    self_goals: "",
    rating_quality: 3,
    rating_delivery: 3,
    rating_communication: 3,
    rating_initiative: 3,
    rating_teamwork: 3,
    self_quality: 3,
    self_delivery: 3,
    self_communication: 3,
    self_initiative: 3,
    self_teamwork: 3,
  });

  const load = () => getReviews().then((r) => setReviews(r.data));
  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await createReview({ ...form, employee_id: parseInt(form.employee_id) });
    toast.success("Review created!");
    setShowForm(false);
    load();
  };

  const generateAI = async (id) => {
    setLoading(id);
    try {
      await generateAIReview(id);
      toast.success("AI review generated!");
      load();
    } catch {
      toast.error("Failed");
    }
    setLoading(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Performance Reviews
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          + New Review
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Create Review</h2>
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
              <label className="text-xs text-gray-500">
                Period (e.g. Q2 2025)
              </label>
              <input
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {["self_achievements", "self_challenges", "self_goals"].map((f) => (
              <div key={f} className="col-span-2">
                <label className="text-xs text-gray-500 capitalize">
                  {f.replace("self_", "Self — ").replace("_", " ")}
                </label>
                <textarea
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  rows={2}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Manager Ratings (1–5)
              </p>
              <div className="grid grid-cols-5 gap-3">
                {[
                  "quality",
                  "delivery",
                  "communication",
                  "initiative",
                  "teamwork",
                ].map((k) => (
                  <div key={k}>
                    <label className="text-xs text-gray-500 capitalize">
                      {k}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={form[`rating_${k}`]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [`rating_${k}`]: parseInt(e.target.value),
                        })
                      }
                      className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={submit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">
                  Employee #{r.employee_id} — {r.period}
                </p>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs ${r.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {r.status}
                </span>
              </div>
              {r.status === "pending" && (
                <button
                  onClick={() => generateAI(r.id)}
                  disabled={loading === r.id}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
                  {loading === r.id
                    ? "Generating AI Review..."
                    : "Generate AI Review"}
                </button>
              )}
            </div>
            {r.ai_summary && (
              <div className="mt-3 space-y-2">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-700 mb-1">
                    AI Summary
                  </p>
                  <p className="text-xs text-gray-700">{r.ai_summary}</p>
                </div>
                {r.ai_mismatch && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-orange-700 mb-1">
                      Rating Mismatches
                    </p>
                    <p className="text-xs text-gray-700">{r.ai_mismatch}</p>
                  </div>
                )}
                {r.ai_actions && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-700 mb-1">
                      Development Actions
                    </p>
                    <p className="text-xs text-gray-700">{r.ai_actions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-gray-400 py-12">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
