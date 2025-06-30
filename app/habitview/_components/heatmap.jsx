'use client'

import { MoveLeft } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppUser } from '@/app/context/UserContext'

const YearlyHeatmap = ({ habitid }) => {
  const userData = useAppUser()
 
  const [userId, setUserId] = useState(null)

  const [habitData, setHabitData] = useState({})
  const [habitInfo, setHabitInfo] = useState(null)
  const [yearData, setYearData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const currentMonthName = monthNames[currentMonth]

  useEffect(() => {
    if (userData?.id) setUserId(userData.id)
  }, [userData])

  useEffect(() => {
    if (!habitid || !userId) return

    const fetchHabitData = async () => {
      try {
        setLoading(true)

        const infoRes = await fetch('/api/get-habit-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId: habitid, userId })
        })

        if (!infoRes.ok) {
          const err = await infoRes.json()
          throw new Error(err.message || 'Failed to fetch habit info')
        }

        const infoData = await infoRes.json()
        setHabitInfo(infoData.data.habit)

        const compRes = await fetch('/api/get-habit-completion-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habitId: habitid, userId })
        })

        if (!compRes.ok) {
          const err = await compRes.json()
          throw new Error(err.message || 'Failed to fetch completions')
        }

        const completionsData = await compRes.json()
        const map = {}
        completionsData.data.forEach(dateStr => {
          const d = new Date(dateStr)
          if (!isNaN(d)) {
            map[d.toISOString().split('T')[0]] = 1
          }
        })
        setHabitData(map)
        setLoading(false)
      } catch (e) {
        setError(e.message)
        setLoading(false)
      }
    }

    fetchHabitData()
  }, [habitid, userId])

  useEffect(() => {
    const buildYear = {}
    const start = new Date(currentYear, 0, 1)
    const end = new Date(currentYear, 11, 31)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().split('T')[0]
      buildYear[iso] = habitData[iso] || 0
    }
    setYearData(buildYear)
  }, [habitData])

  const calculateSuccessRates = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    let weekTotal = 0, weekDone = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      const iso = d.toISOString().split('T')[0]
      if (d <= currentDate) {
        weekTotal++
        if (yearData[iso]) weekDone++
      }
    }

    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0)
    let moTotal = 0, moDone = 0
    for (let d = new Date(monthStart); d <= monthEnd && d <= currentDate; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().split('T')[0]
      moTotal++
      if (yearData[iso]) moDone++
    }

    return {
      weeklyRate: weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0,
      monthlyRate: moTotal ? Math.round((moDone / moTotal) * 100) : 0
    }
  }

  const successRates = calculateSuccessRates()
  // Use Tailwind classes for heatmap cell colors
  const getCellClass = (completed) => completed ? 'bg-green-500 dark:bg-green-400' : 'bg-muted'

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(currentYear, monthIndex)
    const firstDay = getFirstDayOfMonth(currentYear, monthIndex)
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7

    const cells = []
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
      if (isValidDay) {
        const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
        const completed = yearData[dateStr] || 0
        cells.push(
          <div key={i} className={`w-3 h-3 rounded-sm border border-border ${getCellClass(completed)}`} />
        )
      } else {
        cells.push(<div key={i} className="w-3 h-3" />)
      }
    }

    return (
      <div key={monthIndex} className="bg-card p-4 rounded-lg shadow-sm border border-border flex-shrink-0 min-w-[200px]">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">{monthNames[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs text-muted-foreground text-center w-3">{day[0]}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{cells}</div>
      </div>
    )
  }

  const totalCompleted = Object.values(yearData).filter(val => val === 1).length
  const completionRate = Math.round((totalCompleted / 365) * 100)

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background min-h-screen">
      <Link href='/dashboard'><Button><MoveLeft size={20} /></Button></Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-card-foreground mb-2">{habitInfo.name} - {currentYear}</h1>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>Total completed: <span className="font-semibold text-foreground">{totalCompleted}</span></span>
          <span>Completion rate: <span className="font-semibold text-foreground">{completionRate}%</span></span>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Not completed</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm border border-border bg-muted" />
          <div className="w-3 h-3 rounded-sm border border-border bg-green-500 dark:bg-green-400" />
        </div>
        <span>Completed</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg shadow-sm border border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Current Progress</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div><div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{successRates.weeklyRate}%</div><div className="text-sm text-muted-foreground">Current week success rate</div></div>
          <div><div className="text-2xl font-bold text-green-600 dark:text-green-400">{successRates.monthlyRate}%</div><div className="text-sm text-muted-foreground">{currentMonthName} success rate</div></div>
        </div>
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg shadow-sm border border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Habit Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div><div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{habitInfo.currentStreak}</div><div className="text-sm text-muted-foreground">Current streak</div></div>
          <div><div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{habitInfo.longestStreak}</div><div className="text-sm text-muted-foreground">Longest streak</div></div>
          <div><div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCompleted}</div><div className="text-sm text-muted-foreground">Total completed</div></div>
        </div>
      </div>
    </div>
  )
}

export default YearlyHeatmap
