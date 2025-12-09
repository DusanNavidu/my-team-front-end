// src/pages/LiveScores.tsx (FINAL FIX)

import React, { useState } from 'react';

// Live Score Card සඳහා මූලික Data Structure එක
interface LiveScore {
    id: number;
    sport: 'Cricket' | 'Football' | 'Rugby';
    match: string;
    score: string;
    status: 'Live' | 'Upcoming' | 'Finished';
    time: string;
}

// Static/Dummy Live Score Data (API Response එකක් ලෙස උපකල්පනය කරමු)
const dummyScores: LiveScore[] = [
    { id: 1, sport: 'Cricket', match: 'SL vs IND', score: 'SL 150/5 (20)', status: 'Live', time: 'Innings Break' },
    { id: 2, sport: 'Football', match: 'Chelsea vs Arsenal', score: '1 - 0', status: 'Live', time: '75th Min' },
    { id: 3, sport: 'Rugby', match: 'NZ vs SA', score: '25 - 18', status: 'Live', time: '2nd Half' },
    { id: 4, sport: 'Cricket', match: 'AUS vs ENG', score: 'AUS 210/2', status: 'Upcoming', time: 'Starts in 2h' },
    { id: 5, sport: 'Football', match: 'Man Utd vs Liverpool', score: 'Finished', status: 'Finished', time: '2 - 2' },
];

// Reusable Score Card Component (මෙම file එක ඇතුළතම භාවිතා කරමු)
const ScoreCard: React.FC<{ score: LiveScore }> = ({ score }) => {
    
    let statusClass = '';
    if (score.status === 'Live') {
        statusClass = 'bg-red-600 animate-pulse';
    } else if (score.status === 'Upcoming') {
        statusClass = 'bg-yellow-600';
    } else {
        statusClass = 'bg-gray-600';
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-blue-400 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded text-white ${statusClass}`}>
                    {score.status}
                </span>
                <span className="text-gray-400 text-sm">{score.sport}</span>
            </div>
            <h3 className="text-white text-lg font-bold mb-1">{score.match}</h3>
            <p className="text-3xl font-extrabold text-blue-400 my-2">{score.score}</p>
            <p className="text-gray-400 text-sm">{score.time}</p>
        </div>
    );
};


export default function LiveScores() {
    const [activeTab, setActiveTab] = useState<'All' | 'Cricket' | 'Football' | 'Rugby'>('All');

    // Filter scores based on the active tab
    const filteredScores = dummyScores.filter(score => 
        activeTab === 'All' ? true : score.sport === activeTab
    );

    const tabs = ['All', 'Cricket', 'Football', 'Rugby'];

    return (
        <div className="w-full mt-[150px] container mx-auto p-4 text-white">
            <h1 className="text-4xl font-extrabold mb-8 text-white">Live Scores Dashboard</h1>

            {/* --- Tab Navigation --- */}
            <div className="flex space-x-4 border-b border-gray-700 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`
                            py-2 px-4 text-lg font-medium transition-colors duration-200 
                            ${activeTab === tab 
                                ? 'border-b-4 border-blue-500 text-blue-400' 
                                : 'text-gray-400 hover:text-gray-200'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- Scores Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScores.length > 0 ? (
                    filteredScores.map(score => (
                        <ScoreCard key={score.id} score={score} />
                    ))
                ) : (
                    <p className="text-gray-400 text-xl col-span-full">No live scores available for {activeTab}.</p>
                )}
            </div>
        </div>
    );
}