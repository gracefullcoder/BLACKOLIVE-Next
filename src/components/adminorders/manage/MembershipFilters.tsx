import { handleInputChange } from '@/src/utility/basic'
import React from 'react'

function MembershipFilters({ filterOptions, setFilterOptions, triggerFilter }: any) {

    const handleFilterChange = (e: any) => {
        let { name, value } = e.target;
        setFilterOptions((prev: any) => {
            if(name == 'onlyAssigned') value = !prev.onlyAssigned;
            const updated = { ...prev, [name]: value };
            triggerFilter(updated);
            return updated;
        })
    }

    return (
        <div><div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-4">
                <select
                    value={filterOptions.timeFilter}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    name='slot'
                >
                    <option value="all">All Times</option>
                    <option value="morning">Slot-1 (6AM-11AM)</option>
                    <option value="afternoon">Slot-2 (11AM-2PM)</option>
                    <option value="evening">Slot-3 (2PM-5PM)</option>
                    <option value="night">Slot-4 (5PM-12AM)</option>
                </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex gap-2 items-center">
                <input
                    type="date"
                    value={filterOptions.startDate}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    name='startDate'
                />
                <span>to</span>
                <input
                    type="date"
                    value={filterOptions.endDate}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    name='endDate'
                />
            </div>

            {/* Email Search */}
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Search by email"
                    value={filterOptions.search}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    name='search'
                />
            </div>

            <div className="flex items-center gap-2 border p-4 rounded">
                <input
                    type="checkbox"
                    id="assigned"
                    checked={filterOptions.onlyAssigned}
                    name='onlyAssigned'
                    onChange={(e:any) => handleFilterChange(e)}
                    className="h-4 w-4"
                />
                <label htmlFor="assigned">Assigned to me</label>
            </div>
        </div>
        </div>
    )
}

export default MembershipFilters