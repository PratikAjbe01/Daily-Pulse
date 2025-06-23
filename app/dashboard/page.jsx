"use client"
import { useState } from "react"
import { Plus, Trash2, Edit, Flame, Target, LineChart, Camera, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DeleteHabitDialog } from "./_components/delete-popup"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

export default function HabitTrackerDashboard() {
  const {user}=useUser()
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink 8 glasses of water", completed: false, createdAt: new Date() },
    { id: "2", name: "Exercise for 30 minutes", completed: true, createdAt: new Date() },
    { id: "3", name: "Read for 20 minutes", completed: false, createdAt: new Date() },
    { id: "4", name: "Meditate for 10 minutes", completed: true, createdAt: new Date() },
  ])

  const [userData, setUserData] = useState({
    username: "",
    imageUrl: "",
    hasUsername: false,
    hasImageUrl: false,
  })

  const [isEditingImage, setIsEditingImage] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState("")
  const [tempImageFile, setTempImageFile] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState("")
  const [newHabitName, setNewHabitName] = useState("")
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    habitId: null,
    habitName: "",
  })

  const suggestedHabits = [
    "Drink 8 glasses of water",
    "Exercise for 30 minutes",
    "Read for 20 minutes",
    "Write in journal",
  ]

  const handleUsernameEdit = () => {
    setTempUsername(userData.username)
    setIsEditingUsername(true)
  }


  const handleImageEdit = () => {
    setTempImageUrl(userData.imageUrl)
    setIsEditingImage(true)
  }

  const handleUsernameCancel = () => {
    setTempUsername("")
    setIsEditingUsername(false)
  }

  const handleImageCancel = () => {
    setTempImageUrl("")
    setIsEditingImage(false)
  }

  const handleAddUsername = () => {
    setTempUsername("")
    setIsEditingUsername(true)
  }

  const handleAddImage = () => {
    setTempImageUrl("")
    setIsEditingImage(true)
  }
  const handleUsernameSave = async () => {
  setUserData((prev) => ({ ...prev, username: tempUsername, hasUsername: true }));
  await saveUserInfoToDb(tempUsername, userData.imageUrl);
  setIsEditingUsername(false);
  setTempUsername("");
};

const handleImageSave = async () => {
  setUserData((prev) => ({ ...prev, imageUrl: tempImageUrl, hasImageUrl: true }));
  await saveUserInfoToDb(userData.username, tempImageUrl);
  setIsEditingImage(false);
};

 

  const userStats = {
    currentStreak: 7,
    longestStreak: 23,
    rank: "Gold",
    totalHabits: habits.length,
    completedToday: habits.filter((h) => h.completed).length,
  }

  const handleCreateHabit = (e) => {
    e.preventDefault()
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setHabits([...habits, newHabit])
      setNewHabitName("")
    }
  }

  const addSuggestedHabit = (habitName) => {
    const habitExists = habits.some((habit) => habit.name.toLowerCase() === habitName.toLowerCase())
    if (!habitExists) {
      const newHabit = {
        id: Date.now().toString(),
        name: habitName,
        completed: false,
        createdAt: new Date(),
      }
      setHabits([...habits, newHabit])
    }
  }

  const toggleHabitCompletion = (habitId) => {
    setHabits(habits.map((habit) => (habit.id === habitId ? { ...habit, completed: !habit.completed } : habit)))
  }

  const openDeleteDialog = (habitId, habitName) => {
    setDeleteDialog({
      isOpen: true,
      habitId,
      habitName,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      habitId: null,
      habitName: "",
    })
  }

  const confirmDeleteHabit = () => {
    if (deleteDialog.habitId) {
      setHabits(habits.filter((habit) => habit.id !== deleteDialog.habitId))
    }
    closeDeleteDialog()
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="pt-16 min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DailyPulse</h1>
          <p className="text-muted-foreground">Build better habits, one day at a time</p>
        </div>

        {/* Top Row - User Stats and Create Habit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Div - User Stats */}
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.imageUrl || undefined} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {userData.username ? userData.username.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <label className="cursor-pointer flex items-center justify-center bg-background rounded-full p-1 border">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const fileUrl = URL.createObjectURL(file)
                            setTempImageFile(file)
                            setTempImageUrl(fileUrl)
                            setIsEditingImage(true)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Confirm or cancel image */}
                {isEditingImage && tempImageUrl && (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 h-7 text-xs flex-1"
                      onClick={() => {
                        setUserData((prev) => ({ ...prev, imageUrl: tempImageUrl, hasImageUrl: true }))
                        setIsEditingImage(false)
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => {
                        setTempImageFile(null)
                        setTempImageUrl("")
                        setIsEditingImage(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Username Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Username</Label>
                {isEditingUsername ? (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter username"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-7 text-xs flex-1"
                        onClick={handleUsernameSave}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleUsernameCancel}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-foreground text-center p-2 bg-muted rounded">
                      {userData.username || "No username set"}
                    </div>
                    {userData.hasUsername ? (
                      <Button size="sm" variant="outline" onClick={handleUsernameEdit} className="w-full h-7 text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Username
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleAddUsername} className="w-full h-7 text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Add Username
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <Flame className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {userStats.currentStreak}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Current Streak</div>
                </div>

                <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Target className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{userStats.longestStreak}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Longest Streak</div>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {userStats.completedToday} of {userStats.totalHabits} completed today
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${userStats.totalHabits > 0 ? (userStats.completedToday / userStats.totalHabits) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Div - Create Habit Form */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Create New Habit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label htmlFor="habitName" className="block text-sm font-medium text-foreground mb-2">
                    Habit Name
                  </label>
                  <Input
                    id="habitName"
                    type="text"
                    placeholder="Enter your new habit..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Habit
                </Button>
              </form>

              {/* Suggested Habits */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Add Suggestions:</h4>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {suggestedHabits.map((habit, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto p-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => addSuggestedHabit(habit)}
                    >
                      <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{habit}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground text-center">
                  <div>
                    Total Habits: <span className="font-semibold text-foreground">{userStats.totalHabits}</span>
                  </div>
                  <div className="mt-1">
                    Completed Today:{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">{userStats.completedToday}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Div - Habits List */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Today's Habits</CardTitle>
              <div className="text-sm text-muted-foreground font-medium">{getCurrentDate()}</div>
            </div>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No habits yet. Create your first habit above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                      habit.completed
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                        : "bg-card border-border hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          habit.completed ? "bg-green-500 border-green-500" : "border-muted-foreground/30"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          habit.completed ? "text-green-800 dark:text-green-200 line-through" : "text-foreground"
                        }`}
                      >
                        {habit.name}
                      </span>
                      {habit.completed && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <Link href={`habitview/${habit.id}`}>
                          <LineChart className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className={
                          habit.completed
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800"
                            : "hover:bg-accent"
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(habit.id, habit.name)}
                        className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteHabitDialog
          isOpen={deleteDialog.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={confirmDeleteHabit}
          habitName={deleteDialog.habitName}
        />
      </div>
    </div>
  )
}
