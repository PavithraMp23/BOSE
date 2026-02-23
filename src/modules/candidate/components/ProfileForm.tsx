import { useState } from "react";
import { useProfile } from "../hooks/useProfile";

export default function ProfileForm() {
  const { profile, loading, updateProfile } = useProfile();
  const [form, setForm] = useState<any>({});

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return null;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        updateProfile(form);
      }}
      className="space-y-4 bg-secondary p-6 rounded-xl"
    >
      {["name", "email"].map((field) => (
        <div key={field}>
          <label className="block text-sm text-gray-400 capitalize">{field}</label>
          <input
            defaultValue={(profile as any)[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-primary border border-gray-700"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm text-gray-400">Skills (comma separated)</label>
        <input
          defaultValue={profile.skills.join(", ")}
          onChange={e => setForm({ ...form, skills: e.target.value.split(",").map(s => s.trim()) })}
          className="w-full px-3 py-2 rounded-md bg-primary border border-gray-700"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          defaultChecked={profile.visibility}
          onChange={e => setForm({ ...form, visibility: e.target.checked })}
        />
        <span className="text-sm text-gray-400">Visible to recruiters</span>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-accent text-black rounded-md font-semibold"
      >
        Save
      </button>
    </form>
  );
}


