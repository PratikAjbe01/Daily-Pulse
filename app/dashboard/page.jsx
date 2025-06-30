"use client"
import { useState, useEffect } from "react"
import ConfettiExplosion from 'react-confetti-explosion';
import { Plus, Trash2, Edit, Flame, Target, LineChart, Camera, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useAppUser } from "../context/UserContext";

export default function HabitTrackerDashboard() {
  const { user } = useUser()
   const loadagain=useAppUser()
    const setLoadagain=useAppUser()
  const [isDeleting, setIsDeleting] = useState(false)
    const [isExploding, setIsExploding]=useState(false)
  const [habits, setHabits] = useState([ ])
  const [userId, setUserId] = useState(null)
  const [userData, setUserData] = useState({
    username: "",
    imageUrl: "",
    hasUsername: false,
    hasImageUrl: false,
    
  })
  const [trophy,setTrophy]=useState(0);

  const [isEditingImage, setIsEditingImage] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState("")
  const [tempImageFile, setTempImageFile] = useState(null)
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

  useEffect(() => {
    if (userId) {
      fetchHabits()
    }
  }, [userId])
 useEffect(() => {
    async function fetchUserInfo() {
      if (!user?.primaryEmailAddress?.emailAddress) return

      try {
        const res = await fetch(
          `/api/get-info?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`
        )
        if (!res.ok) throw new Error("Failed to fetch user info")
        const data = await res.json()

   if (data) {
    setTrophy(data.trophyCount);
        setUserData({
          username: data.name || "",
          imageUrl: data.imageUrl || "",
          hasUsername: !!data.name,
          hasImageUrl: !!data.imageUrl,
        
        });
        setUserId(data.id);
        }
      } catch (err) {
        console.error("Error fetching user info:", err)
      }
    }

    fetchUserInfo()
  }, [user])


  const fetchHabits = async () => {
    try {
      const res = await fetch(`/api/get-habits?userId=${userId}`)
      if (!res.ok) throw new Error("Failed to fetch habits")
      const json = await res.json()
      if (json.success) {
        setHabits(json.data)
      } else {
        console.error(json.message)
      }
    } catch (error) {
      console.error("Error fetching habits:", error)
    }
  }

  const handleUsernameEdit = () => {
    setTempUsername(userData.username)
    setIsEditingUsername(true)
  }

  const handleUsernameCancel = () => {
    setTempUsername("")
    setIsEditingUsername(false)
  }

  const handleAddUsername = () => {
    setTempUsername("")
    setIsEditingUsername(true)
  }

const handleUsernameSave = async () => {
  try {
   
  
    
   
    await saveUserInfoToDb(tempUsername, userData.imageUrl);
      setUserData(prev => ({
      ...prev,
      username: tempUsername,
      hasUsername: true
    }));

 
    setIsEditingUsername(false);
    
    
  } catch (error) {
    console.error("Failed to save username:", error);
 
    setUserData(prev => ({ 
      ...prev, 
      username: prev.username, 
      hasUsername: !!prev.username 
    }));
  }
};

const handleImageSave = async () => {
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: tempImageUrl }), 
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    const cloudUrl = data.url;

    
    await saveUserInfoToDb(userData.username, cloudUrl);

    setUserData(prev => ({
      ...prev,
      imageUrl: cloudUrl,
      hasImageUrl: true,
    }));

    setIsEditingImage(false);
  } catch (error) {
    console.error("Failed to upload and save image:", error);
  }
};


  const userStats = {
    currentStreak: 7,
    longestStreak: 23,
    rank: 2,
    totalHabits: habits.length,
    completedToday: habits.filter((h) => h.completed).length,
  }

 async function createHabit(){
  if(!userId){
      console.error("No user id found");
    return;
  }
   await fetch("/api/create-habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  userId:userId,
     name: newHabitName,

    })
  });
 setIsExploding(true);
setTimeout(() => setIsExploding(false), 1500);
setNewHabitName(""); 
fetchHabits();
}

  const addSuggestedHabit = (habitName) => {
    setNewHabitName(habitName)
  }


const toggleHabitCompletion = async (habitId) => {
  try {

    const res = await fetch("/api/habit-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId }),
    });

    if (!res.ok) throw new Error("Failed to toggle habit");
    
   
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );

    // 3. Check for trophy after a short delay
    setTimeout(checkAllCompletedAndAwardTrophy, 300);
    
  } catch (error) {
    console.error("Error updating habit:", error);
  }
};
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
const checkAllCompletedAndAwardTrophy = async () => {
  try {

    await fetchHabits();
    
   
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch('/api/increment-trophy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();
    
    if (data.success) {
    setTrophy(data.trophyCount);
      setUserData(prev => ({
        ...prev,
        trophyCount: data.trophyCount
      }));
      
      setIsExploding(true);
   setLoadagain(!loadagain);
      setTimeout(() => setIsExploding(false), 1500);
      
     
      
    }
  } catch (err) {
    console.error("Failed to award trophy:", err);
  }
};

const confirmDeleteHabit = async () => {
  if (!deleteDialog.habitId || !userId) return;

  setIsDeleting(true);
  try {
    const res = await fetch("/api/delete-habit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habitId: deleteDialog.habitId,
        userId: userId,
      }),
    });

    const json = await res.json();
    
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to delete habit");
    }

    // Optimistically update the UI
    setHabits(prev => prev.filter(habit => habit.id !== deleteDialog.habitId));
  } catch (error) {
    console.error("Error deleting habit:", error);
    // You might want to add user feedback here
  } finally {
    setIsDeleting(false);
    closeDeleteDialog();
  }
};

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

async function saveUserInfoToDb(username, imageUrl) {
  if (!user?.primaryEmailAddress?.emailAddress) {
    console.error("No user email found");
    return;
  }

  try {
    const res = await fetch("/api/user-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.primaryEmailAddress.emailAddress,
        name: username,
        imageUrl: imageUrl
      }),
    });

    const data = await res.json();
    
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save user info");
    }

  
    const userRes = await fetch(
      `/api/get-info?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`
    );
    const userData = await userRes.json();
    setUserData(userData);

    return data;
  } catch (error) {
    console.error("Error saving user info:", error);
    throw error; 
  }
}

  return (
    <div className="pt-16 min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DailyPulse</h1>
          <p className="text-muted-foreground">Build better habits, one day at a time</p>
        </div>
          {isExploding && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-50">
    <ConfettiExplosion />
  </div>
)}
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
                    <AvatarImage src={userData.imageUrl} alt="Profile" />
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
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setTempImageUrl(base64String); // base64 image
        setIsEditingImage(true);
      };
      reader.readAsDataURL(file); // read file as base64
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
                      onClick={handleImageSave}
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
{userData.username ? (
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
         <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
  <div className="flex items-center justify-center mb-2">
    🏆
  </div>
  <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
  {trophy}
  </div>
  <div className="text-sm text-yellow-700 dark:text-yellow-300">
    Trophies Earned
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
              <form onSubmit={(e) => {
    e.preventDefault(); // prevent refresh
    createHabit();
  }} className="space-y-4">
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
             <Button type="submit" className="w-full" >
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
           
              <div className="text-xs text-muted-foreground font-medium">{getCurrentDate()}</div>
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
                      <button
                        onClick={() => toggleHabitCompletion(habit.id)
                        }
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
                      {/* Inline badge for desktop */}
                      {habit.completed && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hidden sm:inline-flex"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>
                    {/* Badge below name for mobile */}
                    {habit.completed && (
                      <div className="block sm:hidden mt-2 ml-5">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-xs dark:bg-green-900 text-green-800 dark:text-green-200"
                        >
                          Completed
                        </Badge>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        className="bg-white p-1 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <Link href={`/habitview/${habit.id}`}>
                          <LineChart className="h-3 w-3" />
                        </Link>
                      </Button>
                     

                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => openDeleteDialog(habit.id, habit.name)}
                        className="bg-red-50 p-1 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the habit "{deleteDialog.habitName}" and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
             <AlertDialogAction
  onClick={confirmDeleteHabit}
  className="bg-red-600 hover:bg-red-700"
  disabled={isDeleting}
>
  {isDeleting ? (
    <span className="flex items-center">
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Deleting...
    </span>
  ) : (
    "Delete"
  )}
</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}