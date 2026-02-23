import { useState } from "react";
import { useIssueCredential } from "../hooks/useIssueCredential";

export default function CredentialForm({ onIssued }: { onIssued: () => void }) {
  const { issue } = useIssueCredential(onIssued);
  const [form, setForm] = useState({ student: "", course: "", year: "" });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        issue(form);
        setForm({ student: "", course: "", year: "" });
      }}
      className="flex flex-wrap gap-3 bg-secondary p-4 rounded-xl"
    >
      {(["student", "course", "year"] as const).map(f => (
        <input
          key={f}
          name={f}
          value={(form as any)[f]}
          onChange={e => setForm({ ...form, [f]: e.target.value })}
          placeholder={f[0].toUpperCase() + f.slice(1)}
          className="bg-primary border border-gray-300 rounded-md px-3 py-2"
          required
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-accent text-black rounded-md font-semibold">
        Issue
      </button>
    </form>
  );
}


