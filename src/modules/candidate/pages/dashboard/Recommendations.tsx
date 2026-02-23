import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Sparkles, Briefcase, MapPin, ArrowRight, Building2, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../components/ui/dialog';

// Mock Data
const MOCK_JOBS = [
    {
        id: 1,
        title: "Frontend Engineer",
        company: "TechFlow Systems",
        location: "Remote",
        match: 95,
        skills: ["React", "TypeScript", "Tailwind"],
        description: "Looking for an experienced frontend developer to lead our dashboard team.",
        salary: "$120k - $150k"
    },
    {
        id: 2,
        title: "React Developer",
        company: "Creative Digital",
        location: "New York, NY",
        match: 88,
        skills: ["React", "Redux", "Framer Motion"],
        description: "Join our agency to build award-winning web experiences.",
        salary: "$90k - $110k"
    },
    {
        id: 3,
        title: "Full Stack Engineer",
        company: "BlockSaaS",
        location: "Austin, TX",
        match: 82,
        skills: ["React", "Node.js", "PostgreSQL"],
        description: "Full stack role focusing on blockchain integration.",
        salary: "$130k - $160k"
    },
];

export default function Recommendations() {
    const [selectedJob, setSelectedJob] = useState<any>(null);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">AI Recommendations</h1>
                    <p className="text-slate-500 mt-1">Jobs tailored to your verified skills and credentials.</p>
                </div>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" /> AI Powered
                </div>
            </div>

            <div className="grid gap-6">
                {MOCK_JOBS.map((job) => (
                    <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 cursor-pointer" onClick={() => setSelectedJob(job)}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">{job.match}% Match</span>
                                    </div>
                                    <div className="flex items-center text-slate-600 mb-3 text-sm">
                                        <Building2 className="w-4 h-4 mr-1" /> {job.company}
                                        <span className="mx-2">•</span>
                                        <MapPin className="w-4 h-4 mr-1" /> {job.location}
                                    </div>
                                    <div className="flex gap-2">
                                        {job.skills.map(skill => (
                                            <span key={skill} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200 font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3 self-end md:self-center w-full md:w-auto">
                                    <Button className="bg-slate-900 group-hover:bg-blue-600 text-white transition-colors w-full md:w-auto">
                                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <span className="text-xs text-slate-400">Posted 2 days ago</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Job Details Modal */}
            <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-800">{selectedJob?.title}</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium flex items-center">
                            {selectedJob?.company} • {selectedJob?.location}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedJob && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                                    {selectedJob.match}%
                                </div>
                                <div>
                                    <p className="font-bold text-purple-800">Excellent Match</p>
                                    <p className="text-xs text-purple-600">Your specific skills in React and TypeScript align perfectly.</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">Description</h4>
                                <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">Compensation</h4>
                                <p className="text-slate-800">{selectedJob.salary}</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" className="flex-1" onClick={() => setSelectedJob(null)}>Cancel</Button>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                    Apply Now
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
