import React from 'react';

interface Props {
  onSearch: (filters: Record<string, any>) => void;
}

export default function CandidateSearchBar({ onSearch }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & {
      keyword: HTMLInputElement;
      location: HTMLInputElement;
      verified: HTMLInputElement;
    };
    onSearch({
      keyword: form.keyword.value,
      location: form.location.value,
      verified: form.verified.checked,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-xl">
      <input
        name="keyword"
        placeholder="Search by name or skill"
        className="px-3 py-2 rounded-md border border-gray-300 flex-1"
      />
      <input
        name="location"
        placeholder="Location"
        className="px-3 py-2 rounded-md border border-gray-300 w-48"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="verified" />
        Verified only
      </label>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">
        Search
      </button>
    </form>
  );
}


