'use client'
import React, { useState, useMemo } from 'react';

const YearlyHeatmap = () => {
  const currentYear = new Date().getFullYear();
  

  const generateYearData = (year) => {
    const data = {};
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];

      data[dateStr] = Math.floor(Math.random() * 5);
    }
    return data;
  };

  const [yearData] = useState(() => generateYearData(currentYear));

 
  const getColor = (intensity) => {
    const colors = [
      '#ebedf0', // 0 - white
      '#30a14e', // 3 - green
    
    ];
    return colors[intensity] || colors[0];
  };

 
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };


  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(currentYear, monthIndex);
    const firstDay = getFirstDayOfMonth(currentYear, monthIndex);
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    
    const cells = [];
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      
      if (isValidDay) {
        const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        const intensity = yearData[dateStr] || 0;
        const color = getColor(intensity);
        
        cells.push(
          <div
            key={i}
            className="w-3 h-3 rounded-sm border border-gray-200"
            style={{ backgroundColor: color }}
            title={`${dateStr}: ${intensity} activities`}
          />
        );
      } else {
        cells.push(
          <div
            key={i}
            className="w-3 h-3"
          />
        );
      }
    }

    return (
      <div key={monthIndex} className="bg-white p-4 rounded-lg shadow-sm border flex-shrink-0 min-w-[200px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {monthNames[monthIndex]}
        </h3>
        
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center w-3">
              {day[0]}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells}
        </div>
      </div>
    );
  };

  // Calculate total activity for the year
  const totalActivity = Object.values(yearData).reduce((sum, val) => sum + val, 0);
  const averageDaily = (totalActivity / 365).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Activity Heatmap - {currentYear}
        </h1>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span>Total activities: <span className="font-semibold">{totalActivity}</span></span>
          <span>Daily average: <span className="font-semibold">{averageDaily}</span></span>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div
              key={intensity}
              className="w-3 h-3 rounded-sm border border-white-200"
              style={{ backgroundColor: getColor(intensity) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Monthly heatmaps grid */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>

      {/* Activity summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Year Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(yearData).filter(v => v > 0).length}
            </div>
            <div className="text-sm text-gray-600">Active days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(yearData).filter(v => v >= 3).length}
            </div>
            <div className="text-sm text-gray-600">High activity days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...Object.values(yearData))}
            </div>
            <div className="text-sm text-gray-600">Peak activity</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((Object.values(yearData).filter(v => v > 0).length / 365) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Activity rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyHeatmap;