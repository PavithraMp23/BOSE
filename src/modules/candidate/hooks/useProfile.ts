import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ui/toast";

export interface CandidateProfile {
  name: string;
  email: string;
  skills: string[];
  resumeURL: string;
  visibility: boolean;
}

export function useProfile() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    const res = await api.get("/api/candidate/profile");
    setProfile(res.data);
    setLoading(false);
  };

  const updateProfile = async (payload: Partial<CandidateProfile>) => {
    const res = await api.post("/api/candidate/profile", payload);
    setProfile(res.data);
    toast({ title: "Profile updated", variant: "success" });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, updateProfile };
}


