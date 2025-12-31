/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Metric,
  AdminTab,
  AdminMessage,
  EditableItem,
  Tab,
} from "@/types/admin";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<AdminMessage | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("profile");

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  // Edit states
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const authHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${password}`,
      "Content-Type": "application/json",
    }),
    [password],
  );

  // Fetch functions
  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/admin/profile", { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setProfile(data[0] || null);
    }
  }, [authHeaders]);

  const fetchExperiences = useCallback(async () => {
    const res = await fetch("/api/admin/experiences", { headers: authHeaders() });
    if (res.ok) setExperiences(await res.json());
  }, [authHeaders]);

  const fetchEducation = useCallback(async () => {
    const res = await fetch("/api/admin/education", { headers: authHeaders() });
    if (res.ok) setEducation(await res.json());
  }, [authHeaders]);

  const fetchSkills = useCallback(async () => {
    const res = await fetch("/api/admin/skills", { headers: authHeaders() });
    if (res.ok) setSkills(await res.json());
  }, [authHeaders]);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/admin/projects", { headers: authHeaders() });
    if (res.ok) setProjects(await res.json());
  }, [authHeaders]);

  const fetchCertifications = useCallback(async () => {
    const res = await fetch("/api/admin/certifications", { headers: authHeaders() });
    if (res.ok) setCertifications(await res.json());
  }, [authHeaders]);

  const fetchMetrics = useCallback(async () => {
    const res = await fetch("/api/admin/metrics", { headers: authHeaders() });
    if (res.ok) setMetrics(await res.json());
  }, [authHeaders]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchExperiences(),
      fetchEducation(),
      fetchSkills(),
      fetchProjects(),
      fetchCertifications(),
      fetchMetrics(),
    ]);
    setLoading(false);
  }, [
    fetchProfile,
    fetchExperiences,
    fetchEducation,
    fetchSkills,
    fetchProjects,
    fetchCertifications,
    fetchMetrics,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setPassword(savedToken);
      fetch("/api/admin/profile", {
        headers: { Authorization: `Bearer ${savedToken}` },
      }).then((res) => {
        if (res.ok) setIsAuthenticated(true);
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/profile", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_token", password);
    } else {
      setMessage({ type: "error", text: "Invalid password" });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("admin_token");
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // CRUD handlers
  const handleSave = async (
    endpoint: string,
    data: Partial<Experience | Education | Skill | Project | Certification | Profile>,
    isNew: boolean,
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: isNew ? "POST" : "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showMessage("success", `${isNew ? "Created" : "Updated"} successfully!`);
        setEditingItem(null);
        setIsCreating(false);
        fetchAllData();
      } else {
        const err = await res.json();
        showMessage("error", err.error || "Failed to save");
      }
    } catch {
      showMessage("error", "Network error");
    }
    setLoading(false);
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${endpoint}?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.ok) {
        showMessage("success", "Deleted successfully!");
        fetchAllData();
      } else {
        showMessage("error", "Failed to delete");
      }
    } catch {
      showMessage("error", "Network error");
    }
    setLoading(false);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🔐 Admin Panel</h1>
            <p className="mt-2 text-zinc-400">Portfolio Content Management</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
          {message && (
            <p
              className={`text-center text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "certifications", label: "Certifications", icon: "📜" },
    { id: "metrics", label: "Highlights", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">📁 Portfolio Admin</h1>
            <a
              href="/api/cv-db"
              target="_blank"
              className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium hover:bg-green-700"
            >
              📄 Download CV (Database)
            </a>
            <a
              href="/api/cv"
              target="_blank"
              className="rounded bg-zinc-600 px-3 py-1.5 text-sm font-medium hover:bg-zinc-700"
            >
              📄 CV (Legacy JSON)
            </a>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-white">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex gap-1 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Status Messages */}
        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 ${
              message.type === "success"
                ? "bg-green-900/50 text-green-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading && <div className="mb-4 text-center text-zinc-400">Loading...</div>}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <ProfileForm
            profile={profile}
            onSave={(data) => handleSave("profile", data, !profile)}
          />
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <ListEditor
            title="Work Experience"
            items={experiences}
            onAdd={() => {
              setIsCreating(true);
              setEditingItem({
                company: "",
                position: "",
                location: "",
                startDate: new Date().toISOString().split("T")[0],
                endDate: null,
                isCurrent: false,
                description: "",
                highlights: "[]",
                employmentType: "Full-time",
                sortOrder: experiences.length,
                isVisible: true,
              });
            }}
            onEdit={(item) => {
              setIsCreating(false);
              setEditingItem(item);
            }}
            onDelete={(id) => handleDelete("experiences", id)}
            renderItem={(item: Experience) => (
              <div>
                <div className="font-medium">{item.position}</div>
                <div className="text-sm text-zinc-400">{item.company}</div>
              </div>
            )}
            editForm={
              editingItem && (
                <ExperienceForm
                  data={editingItem as Experience}
                  onChange={setEditingItem}
                  onSave={() => handleSave("experiences", editingItem, isCreating)}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              )
            }
          />
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <ListEditor
            title="Education"
            items={education}
            onAdd={() => {
              setIsCreating(true);
              setEditingItem({
                institution: "",
                degree: "",
                field: "",
                location: "",
                startDate: new Date().toISOString().split("T")[0],
                endDate: null,
                isCurrent: false,
                gpa: "",
                description: "",
                highlights: "[]",
                sortOrder: education.length,
                isVisible: true,
              });
            }}
            onEdit={(item) => {
              setIsCreating(false);
              setEditingItem(item);
            }}
            onDelete={(id) => handleDelete("education", id)}
            renderItem={(item: Education) => (
              <div>
                <div className="font-medium">
                  {item.degree} in {item.field}
                </div>
                <div className="text-sm text-zinc-400">{item.institution}</div>
              </div>
            )}
            editForm={
              editingItem && (
                <EducationForm
                  data={editingItem as Education}
                  onChange={setEditingItem}
                  onSave={() => handleSave("education", editingItem, isCreating)}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              )
            }
          />
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <ListEditor
            title="Skills"
            items={skills}
            onAdd={() => {
              setIsCreating(true);
              setEditingItem({
                name: "",
                category: "Frontend",
                level: 3,
                icon: "",
                sortOrder: skills.length,
                isVisible: true,
              });
            }}
            onEdit={(item) => {
              setIsCreating(false);
              setEditingItem(item);
            }}
            onDelete={(id) => handleDelete("skills", id)}
            renderItem={(item: Skill) => (
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.name}</span>
                <span className="rounded bg-zinc-700 px-2 py-0.5 text-xs">
                  {item.category}
                </span>
              </div>
            )}
            editForm={
              editingItem && (
                <SkillForm
                  data={editingItem as Skill}
                  onChange={setEditingItem}
                  onSave={() => handleSave("skills", editingItem, isCreating)}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              )
            }
          />
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <ListEditor
            title="Projects"
            items={projects}
            onAdd={() => {
              setIsCreating(true);
              setEditingItem({
                title: "",
                slug: "",
                summary: "",
                description: "",
                problem: "",
                approach: "[]",
                role: "",
                liveUrl: "",
                githubUrl: "",
                caseStudyUrl: "",
                thumbnailUrl: "",
                heroImageUrl: "",
                techStack: "[]",
                outcomes: "[]",
                category: "Web Development",
                tags: "[]",
                client: "",
                timeline: "",
                featured: false,
                sortOrder: projects.length,
                isVisible: true,
              });
            }}
            onEdit={(item) => {
              setIsCreating(false);
              setEditingItem(item);
            }}
            onDelete={(id) => handleDelete("projects", id)}
            renderItem={(item: Project) => (
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.title}</span>
                {item.featured && <span className="text-yellow-500">⭐</span>}
              </div>
            )}
            editForm={
              editingItem && (
                <ProjectForm
                  data={editingItem as Project}
                  onChange={setEditingItem}
                  onSave={() => handleSave("projects", editingItem, isCreating)}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              )
            }
          />
        )}

        {/* Certifications Tab */}
        {activeTab === "certifications" && (
          <ListEditor
            title="Certifications"
            items={certifications}
            onAdd={() => {
              setIsCreating(true);
              setEditingItem({
                name: "",
                issuer: "",
                issueDate: new Date().toISOString().split("T")[0],
                expiryDate: null,
                credentialId: "",
                credentialUrl: "",
                description: "",
                sortOrder: certifications.length,
                isVisible: true,
              });
            }}
            onEdit={(item) => {
              setIsCreating(false);
              setEditingItem(item);
            }}
            onDelete={(id) => handleDelete("certifications", id)}
            renderItem={(item: Certification) => (
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-zinc-400">{item.issuer}</div>
              </div>
            )}
            editForm={
              editingItem && (
                <CertificationForm
                  data={editingItem as Certification}
                  onChange={setEditingItem}
                  onSave={() => handleSave("certifications", editingItem, isCreating)}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              )
            }
          />
        )}

        {/* Metrics (Highlights) Tab */}
        {activeTab === "metrics" && (
          <ListEditor
            title="Highlights (Metrics)"
            items={metrics}
            onAdd={() => {
              setIsCreating(true);
              setEditingItem({
                label: "",
                value: "",
                description: "",
                sortOrder: metrics.length,
                isVisible: true,
              });
            }}
            onEdit={(item) => {
              setIsCreating(false);
              setEditingItem(item);
            }}
            onDelete={(id) => handleDelete("metrics", id)}
            renderItem={(item: Metric) => (
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-zinc-400">{item.value}</div>
              </div>
            )}
            editForm={
              editingItem && (
                <MetricForm
                  data={editingItem as Metric}
                  onChange={setEditingItem}
                  onSave={() => handleSave("metrics", editingItem, isCreating)}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              )
            }
          />
        )}
      </main>
    </div>
  );
}

// ==================== FORM COMPONENTS ====================

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-zinc-600 bg-zinc-800"
      />
      {label}
    </label>
  );
}

// Array input for simple string arrays (highlights, tags, tech stack, approach)
function ArrayInputField({
  label,
  value,
  onChange,
  placeholder = "Enter item...",
}: {
  label: string;
  value: string; // JSON string
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  // Parse JSON string to array
  const parseItems = (jsonStr: string): string[] => {
    try {
      const parsed = JSON.parse(jsonStr) as unknown;
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  };

  const items = parseItems(value);

  const updateItems = (newItems: string[]) => {
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    updateItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    updateItems(newItems);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-lg bg-red-600/20 px-3 py-2 text-red-400 hover:bg-red-600/30"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded-lg border border-dashed border-zinc-600 px-3 py-2 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
        >
          <span>+</span> Add item
        </button>
      </div>
    </div>
  );
}

// Array input for key-value pairs (outcomes)
function KeyValueArrayField({
  label,
  value,
  onChange,
  keyPlaceholder = "Label",
  valuePlaceholder = "Value",
}: {
  label: string;
  value: string; // JSON string of [{label, value}]
  onChange: (value: string) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  type KeyValue = { label: string; value: string };

  const parseItems = (jsonStr: string): KeyValue[] => {
    try {
      const parsed = JSON.parse(jsonStr) as unknown;
      return Array.isArray(parsed) ? (parsed as KeyValue[]) : [];
    } catch {
      return [];
    }
  };

  const items = parseItems(value);

  const updateItems = (newItems: KeyValue[]) => {
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    updateItems([...items, { label: "", value: "" }]);
  };

  const removeItem = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "label" | "value", newValue: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: newValue };
    updateItems(newItems);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(index, "label", e.target.value)}
              placeholder={keyPlaceholder}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) => updateItem(index, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-lg bg-red-600/20 px-3 py-2 text-red-400 hover:bg-red-600/30"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded-lg border border-dashed border-zinc-600 px-3 py-2 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
        >
          <span>+</span> Add item
        </button>
      </div>
    </div>
  );
}

function FormActions({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-2 pt-4">
      <button
        type="button"
        onClick={onSave}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        💾 Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg bg-zinc-700 px-4 py-2 font-medium text-white hover:bg-zinc-600"
      >
        Cancel
      </button>
    </div>
  );
}

// ==================== LIST EDITOR ====================

function ListEditor<T extends { id: string }>({
  title,
  items,
  onAdd,
  onEdit,
  onDelete,
  renderItem,
  editForm,
}: {
  title: string;
  items: T[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  editForm: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* List */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onAdd}
            className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium hover:bg-green-700"
          >
            + Add New
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-zinc-500">
            No items yet. Click &quot;Add New&quot; to create one.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 p-3"
              >
                {renderItem(item)}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded bg-red-600 px-2 py-1 text-xs hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Form */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        {editForm || (
          <p className="text-center text-zinc-500">
            Select an item to edit or add a new one.
          </p>
        )}
      </div>
    </div>
  );
}

// ==================== SPECIFIC FORMS ====================

function ProfileForm({
  profile,
  onSave,
}: {
  profile: Profile | null;
  onSave: (data: Record<string, unknown>) => void;
}) {
  const [data, setData] = useState<Partial<Profile>>(
    profile || {
      name: "",
      headline: "",
      tagline: "",
      email: "",
      phone: "",
      location: "",
      availability: "",
      avatarUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      websiteUrl: "",
      summary: "",
    },
  );

  useEffect(() => {
    if (profile) setData(profile);
  }, [profile]);

  const update = (field: keyof Profile, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">👤 Profile Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Full Name"
          value={data.name || ""}
          onChange={(v) => update("name", v)}
          required
        />
        <InputField
          label="Email"
          value={data.email || ""}
          onChange={(v) => update("email", v)}
          type="email"
          required
        />
        <InputField
          label="Headline"
          value={data.headline || ""}
          onChange={(v) => update("headline", v)}
          placeholder="e.g., Full-stack Developer"
        />
        <InputField
          label="Phone"
          value={data.phone || ""}
          onChange={(v) => update("phone", v)}
        />
        <InputField
          label="Location"
          value={data.location || ""}
          onChange={(v) => update("location", v)}
          placeholder="e.g., Ho Chi Minh City, Vietnam"
        />
        <InputField
          label="Availability"
          value={data.availability || ""}
          onChange={(v) => update("availability", v)}
          placeholder="e.g., Open to opportunities"
        />
        <div className="md:col-span-2">
          <InputField
            label="Tagline"
            value={data.tagline || ""}
            onChange={(v) => update("tagline", v)}
            placeholder="Short description of what you do"
          />
        </div>
        <InputField
          label="Avatar URL"
          value={data.avatarUrl || ""}
          onChange={(v) => update("avatarUrl", v)}
        />
        <InputField
          label="LinkedIn URL"
          value={data.linkedinUrl || ""}
          onChange={(v) => update("linkedinUrl", v)}
        />
        <InputField
          label="GitHub URL"
          value={data.githubUrl || ""}
          onChange={(v) => update("githubUrl", v)}
        />
        <InputField
          label="Website URL"
          value={data.websiteUrl || ""}
          onChange={(v) => update("websiteUrl", v)}
        />
        <div className="md:col-span-2">
          <TextAreaField
            label="Professional Summary"
            value={data.summary || ""}
            onChange={(v) => update("summary", v)}
            rows={5}
            placeholder="Write a compelling summary of your professional background..."
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => onSave(data)}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
        >
          💾 Save Profile
        </button>
      </div>
    </div>
  );
}

function ExperienceForm({
  data,
  onChange,
  onSave,
  onCancel,
}: {
  data: Experience;
  onChange: (data: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">💼 Experience Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Company"
          value={data.company}
          onChange={(v) => update("company", v)}
          required
        />
        <InputField
          label="Position"
          value={data.position}
          onChange={(v) => update("position", v)}
          required
        />
        <InputField
          label="Location"
          value={data.location || ""}
          onChange={(v) => update("location", v)}
        />
        <SelectField
          label="Employment Type"
          value={data.employmentType}
          onChange={(v) => update("employmentType", v)}
          options={[
            { value: "Full-time", label: "Full-time" },
            { value: "Part-time", label: "Part-time" },
            { value: "Contract", label: "Contract" },
            { value: "Internship", label: "Internship" },
            { value: "Freelance", label: "Freelance" },
          ]}
        />
        <InputField
          label="Start Date"
          value={formatDate(data.startDate)}
          onChange={(v) => update("startDate", v)}
          type="date"
          required
        />
        <InputField
          label="End Date"
          value={formatDate(data.endDate)}
          onChange={(v) => update("endDate", v || null)}
          type="date"
        />
      </div>
      <CheckboxField
        label="Currently working here"
        checked={data.isCurrent}
        onChange={(v) => update("isCurrent", v)}
      />
      <TextAreaField
        label="Description"
        value={data.description}
        onChange={(v) => update("description", v)}
        rows={3}
      />
      <ArrayInputField
        label="Highlights"
        value={data.highlights}
        onChange={(v) => update("highlights", v)}
        placeholder="Enter an achievement or highlight..."
      />
      <CheckboxField
        label="Visible on CV"
        checked={data.isVisible}
        onChange={(v) => update("isVisible", v)}
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function EducationForm({
  data,
  onChange,
  onSave,
  onCancel,
}: {
  data: Education;
  onChange: (data: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">🎓 Education Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Institution"
          value={data.institution}
          onChange={(v) => update("institution", v)}
          required
        />
        <InputField
          label="Degree"
          value={data.degree}
          onChange={(v) => update("degree", v)}
          required
          placeholder="e.g., Bachelor of Science"
        />
        <InputField
          label="Field of Study"
          value={data.field}
          onChange={(v) => update("field", v)}
          required
          placeholder="e.g., Computer Science"
        />
        <InputField
          label="Location"
          value={data.location || ""}
          onChange={(v) => update("location", v)}
        />
        <InputField
          label="Start Date"
          value={formatDate(data.startDate)}
          onChange={(v) => update("startDate", v)}
          type="date"
          required
        />
        <InputField
          label="End Date"
          value={formatDate(data.endDate)}
          onChange={(v) => update("endDate", v || null)}
          type="date"
        />
        <InputField
          label="GPA"
          value={data.gpa || ""}
          onChange={(v) => update("gpa", v)}
          placeholder="e.g., 3.8/4.0"
        />
      </div>
      <CheckboxField
        label="Currently studying"
        checked={data.isCurrent}
        onChange={(v) => update("isCurrent", v)}
      />
      <TextAreaField
        label="Description"
        value={data.description}
        onChange={(v) => update("description", v)}
      />
      <CheckboxField
        label="Visible on CV"
        checked={data.isVisible}
        onChange={(v) => update("isVisible", v)}
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function SkillForm({
  data,
  onChange,
  onSave,
  onCancel,
}: {
  data: Skill;
  onChange: (data: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">⚡ Skill Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Skill Name"
          value={data.name}
          onChange={(v) => update("name", v)}
          required
        />
        <SelectField
          label="Category"
          value={data.category}
          onChange={(v) => update("category", v)}
          options={[
            { value: "Frontend Development", label: "Frontend Development" },
            {
              value: "End-to-End Development & Integration",
              label: "End-to-End Development & Integration",
            },
            { value: "Deployment & Operations", label: "Deployment & Operations" },
            { value: "AI/ML", label: "AI/ML" },
            { value: "Backend", label: "Backend" },
            { value: "Database", label: "Database" },
            { value: "Tools", label: "Tools" },
            { value: "Soft Skills", label: "Soft Skills" },
          ]}
        />
        <SelectField
          label="Proficiency Level"
          value={String(data.level)}
          onChange={(v) => update("level", parseInt(v))}
          options={[
            { value: "1", label: "1 - Beginner" },
            { value: "2", label: "2 - Elementary" },
            { value: "3", label: "3 - Intermediate" },
            { value: "4", label: "4 - Advanced" },
            { value: "5", label: "5 - Expert" },
          ]}
        />
        <InputField
          label="Icon"
          value={data.icon || ""}
          onChange={(v) => update("icon", v)}
          placeholder="Icon name or URL"
        />
      </div>
      <CheckboxField
        label="Visible on CV"
        checked={data.isVisible}
        onChange={(v) => update("isVisible", v)}
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function ProjectForm({
  data,
  onChange,
  onSave,
  onCancel,
}: {
  data: Project;
  onChange: (data: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
      <h3 className="text-lg font-semibold">🚀 Project Details</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Title"
          value={data.title}
          onChange={(v) => update("title", v)}
          required
        />
        <InputField
          label="Slug"
          value={data.slug}
          onChange={(v) => update("slug", v)}
          required
          placeholder="project-url-slug"
        />
        <InputField
          label="Client/Company"
          value={data.client || ""}
          onChange={(v) => update("client", v)}
        />
        <InputField
          label="Timeline"
          value={data.timeline || ""}
          onChange={(v) => update("timeline", v)}
          placeholder="e.g., 2024 - Present"
        />
        <InputField
          label="Role"
          value={data.role}
          onChange={(v) => update("role", v)}
          placeholder="e.g., Lead Developer"
        />
        <SelectField
          label="Category"
          value={data.category}
          onChange={(v) => update("category", v)}
          options={[
            { value: "Web Development", label: "Web Development" },
            { value: "Mobile App", label: "Mobile App" },
            { value: "AI/ML", label: "AI/ML" },
            { value: "Full-Stack", label: "Full-Stack" },
            { value: "Design System", label: "Design System" },
            { value: "DevOps", label: "DevOps" },
          ]}
        />
      </div>

      <TextAreaField
        label="Summary"
        value={data.summary}
        onChange={(v) => update("summary", v)}
        rows={2}
        placeholder="Short summary of the project"
      />

      <TextAreaField
        label="Problem Statement"
        value={data.problem}
        onChange={(v) => update("problem", v)}
        rows={2}
        placeholder="What problem did this project solve?"
      />

      <TextAreaField
        label="Full Description (Markdown)"
        value={data.description}
        onChange={(v) => update("description", v)}
        rows={4}
      />

      <ArrayInputField
        label="Approach"
        value={data.approach}
        onChange={(v) => update("approach", v)}
        placeholder="Enter an approach step..."
      />

      <ArrayInputField
        label="Tech Stack"
        value={data.techStack}
        onChange={(v) => update("techStack", v)}
        placeholder="e.g., Next.js, TypeScript..."
      />

      <KeyValueArrayField
        label="Outcomes"
        value={data.outcomes}
        onChange={(v) => update("outcomes", v)}
        keyPlaceholder="Label (e.g., Performance)"
        valuePlaceholder="Value (e.g., +50%)"
      />

      <ArrayInputField
        label="Tags"
        value={data.tags}
        onChange={(v) => update("tags", v)}
        placeholder="e.g., React, AI, Full-Stack..."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Live URL"
          value={data.liveUrl || ""}
          onChange={(v) => update("liveUrl", v)}
        />
        <InputField
          label="GitHub URL"
          value={data.githubUrl || ""}
          onChange={(v) => update("githubUrl", v)}
        />
        <InputField
          label="Case Study URL"
          value={data.caseStudyUrl || ""}
          onChange={(v) => update("caseStudyUrl", v)}
        />
        <InputField
          label="Thumbnail URL"
          value={data.thumbnailUrl || ""}
          onChange={(v) => update("thumbnailUrl", v)}
        />
      </div>

      <div className="flex gap-4">
        <CheckboxField
          label="Featured Project"
          checked={data.featured}
          onChange={(v) => update("featured", v)}
        />
        <CheckboxField
          label="Visible"
          checked={data.isVisible}
          onChange={(v) => update("isVisible", v)}
        />
      </div>

      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function CertificationForm({
  data,
  onChange,
  onSave,
  onCancel,
}: {
  data: Certification;
  onChange: (data: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📜 Certification Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Certification Name"
          value={data.name}
          onChange={(v) => update("name", v)}
          required
        />
        <InputField
          label="Issuing Organization"
          value={data.issuer}
          onChange={(v) => update("issuer", v)}
          required
        />
        <InputField
          label="Issue Date"
          value={formatDate(data.issueDate)}
          onChange={(v) => update("issueDate", v)}
          type="date"
          required
        />
        <InputField
          label="Expiry Date"
          value={formatDate(data.expiryDate)}
          onChange={(v) => update("expiryDate", v || null)}
          type="date"
        />
        <InputField
          label="Credential ID"
          value={data.credentialId || ""}
          onChange={(v) => update("credentialId", v)}
        />
        <InputField
          label="Credential URL"
          value={data.credentialUrl || ""}
          onChange={(v) => update("credentialUrl", v)}
        />
      </div>
      <TextAreaField
        label="Description"
        value={data.description}
        onChange={(v) => update("description", v)}
      />
      <CheckboxField
        label="Visible on CV"
        checked={data.isVisible}
        onChange={(v) => update("isVisible", v)}
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function MetricForm({
  data,
  onChange,
  onSave,
  onCancel,
}: {
  data: Metric;
  onChange: (data: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📊 Highlight/Metric Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Label"
          value={data.label}
          onChange={(v) => update("label", v)}
          required
          placeholder="e.g., Projects Delivered"
        />
        <InputField
          label="Value"
          value={data.value}
          onChange={(v) => update("value", v)}
          required
          placeholder="e.g., 50+"
        />
      </div>
      <TextAreaField
        label="Description"
        value={data.description}
        onChange={(v) => update("description", v)}
        placeholder="Brief description of this metric"
      />
      <InputField
        label="Sort Order"
        value={String(data.sortOrder)}
        onChange={(v) => update("sortOrder", parseInt(v) || 0)}
        type="number"
      />
      <CheckboxField
        label="Visible on site"
        checked={data.isVisible}
        onChange={(v) => update("isVisible", v)}
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}
