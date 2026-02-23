import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Download, BarChart3 } from 'lucide-react';

export default function Analytics() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-purple-200 shadow-xl bg-white">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        <CardTitle className="text-xl">Skill Proficiency</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-64 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center border-2 border-purple-200">
                            <div className="text-center">
                                <BarChart3 className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                                <p className="text-slate-700 font-semibold">Pie Chart: Skill Proficiency</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 shadow-xl bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <CardTitle className="text-xl">Career Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-64 rounded-lg bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center border-2 border-blue-200">
                            <div className="text-center">
                                <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                                <p className="text-slate-700 font-semibold">Line Graph: Career Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 border-green-200 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <CardTitle className="text-xl">Export Reports</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg">
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                            <Download className="w-4 h-4 mr-2" />
                            Export Excel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
