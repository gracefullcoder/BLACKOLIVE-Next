"use client"
import React, { useState } from 'react'

import { productType } from '@/src/types/product';
import { Calendar } from 'lucide-react';
import MembershipPlanner from './MembershipPlanner';

function CustomizeButton({ product, weeklyPlan, setWeeklyPlan, daysOfWeek }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='self-end'>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
                <Calendar size={20} />
                Customize Weekly Plan
            </button>
            {isModalOpen && <MembershipPlanner isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} membershipData={product} weeklyPlan={weeklyPlan} setWeeklyPlan={setWeeklyPlan} daysOfWeek={daysOfWeek} />}
        </div>
    )
}

export default CustomizeButton