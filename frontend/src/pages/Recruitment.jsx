import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  getCandidates,
  addCandidate,
  updateCandidateStage,
} from "../api";
import toast from "react-hot-toast";

const STAGES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export default function Recruitment() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCandForm, setShowCandForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    experience_level: "",
  });
  const [candForm, setCandForm] = useState({
    name: "",
    email: "",
    resume: null,
  });

  useEffect(() => {
    getJobs().then((r) => setJobs(r.data));
  }, []);

  const selectJob = async (job) => {
    setSelectedJob(job);
    const res = await getCandidates(job.id);
    setCandidates(res.data);
  };

  const submitJob = async () => {
    await createJob(jobForm);
    toast.success("Job created!");
    setShowJobForm(false);
    getJobs().then((r) => setJobs(r.data));
  };

  const submitCandidate = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("name", candForm.name);
    fd.append("email", candForm.email);
    fd.append("resume", candForm.resume);
    try {
      await addCandidate(selectedJob.id, fd);
      toast.success("Candidate added! AI scored the resume.");
      setShowCandForm(false);
      selectJob(selectedJob);
    } catch {
      toast.error("Failed");
    }
    setLoading(false);
  };

  const changeStage = async (candidateId, stage) => {
    await updateCandidateStage(candidateId, stage);
    selectJob(selectedJob);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
        <button
          onClick={() => setShowJobForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          + Post Job
        </button>
      </div>

      {showJobForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">New Job Posting</h2>
          <div className="grid grid-cols-2 gap-4">
            {["title", "required_skills", "experience_level"].map((f) => (
              <div key={f}>
                <label className="text-xs text-gray-500 capitalize">
                  {f.replace("_", " ")}
                </label>
                <input
                  value={jobForm[f]}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, [f]: e.target.value })
                  }
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Job Description</label>
              <textarea
                value={jobForm.description}
                onChange={(e) =>
                  setJobForm({ ...jobForm, description: e.target.value })
                }
                rows={3}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={submitJob}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Create Job
            </button>
            <button
              onClick={() => setShowJobForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div>
          <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
            Job Postings
          </h2>
          <div className="space-y-2">
            {jobs.map((j) => (
              <div
                key={j.id}
                onClick={() => selectJob(j)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedJob?.id === j.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <p className="font-medium text-gray-900 text-sm">{j.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {j.experience_level}
                </p>
                <span
                  className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${j.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          {selectedJob ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Candidates — {selectedJob.title}
                </h2>
                <button
                  onClick={() => setShowCandForm(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                  + Add Candidate
                </button>
              </div>

              {showCandForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <input
                        value={candForm.name}
                        onChange={(e) =>
                          setCandForm({ ...candForm, name: e.target.value })
                        }
                        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <input
                        value={candForm.email}
                        onChange={(e) =>
                          setCandForm({ ...candForm, email: e.target.value })
                        }
                        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500">
                        Resume (PDF)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setCandForm({
                            ...candForm,
                            resume: e.target.files[0],
                          })
                        }
                        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={submitCandidate}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">
                      {loading ? "AI Scoring..." : "Add & Score"}
                    </button>
                    <button
                      onClick={() => setShowCandForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {c.ai_score !== null && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${c.ai_score >= 70 ? "bg-green-100 text-green-700" : c.ai_score >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {c.ai_score}%
                          </span>
                        )}
                        <select
                          value={c.stage}
                          onChange={(e) => changeStage(c.id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none">
                          {STAGES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {c.ai_summary && (
                      <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded-lg">
                        {c.ai_summary}
                      </p>
                    )}
                    {c.interview_questions && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer">
                          View AI Interview Questions
                        </summary>
                        <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                          {c.interview_questions}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
                {candidates.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">
                    No candidates yet.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Select a job to view candidates
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
