"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award, Crown, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { db } from "@/configs"
import { users } from "@/configs/schema"

export default function RankingPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10
    const [allUsers,setAllUsers]=useState([]);
useEffect(()=>{
const fetchallUser=async()=>{
  const userList = await db.select().from(users);
  const sortedUsers = userList.sort((a, b) => b.trophyCount - a.trophyCount);
  console.log(sortedUsers)
setAllUsers(sortedUsers);

}
fetchallUser();
},[])
  


  const totalPages = Math.ceil(allUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const currentUsers = allUsers.slice(startIndex, startIndex + usersPerPage)

  const getRankIcon = (position) => {
    if (position === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (position === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (position === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <Trophy className="h-5 w-5 text-muted-foreground" />
  }

  const getPositionStyle = (position) => {
    if (position === 1)
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800"
    if (position === 2)
      return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 border-gray-200 dark:border-gray-800"
    if (position === 3)
      return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800"
    return "bg-card border-border hover:bg-accent/50"
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className=" pt-16 min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-foreground">LeaderBoard</h1>
          </div>
          <p className="text-muted-foreground">Compete with habit trackers worldwide and climb the leaderboard!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{allUsers.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{allUsers[0]?.trophyCount || 0}</div>
              <div className="text-sm text-muted-foreground">Top Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{allUsers[0]?.name || "N/A"}</div>
              <div className="text-sm text-muted-foreground">Current Leader</div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Leaderboard</span>
              <Badge variant="secondary" className="ml-auto">
                Page {currentPage} of {totalPages}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 p-6">
              {currentUsers.map((user, index) => {
                const globalPosition = startIndex + index + 1
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${getPositionStyle(globalPosition)}`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12">
                        {globalPosition <= 3 ? (
                          getRankIcon(globalPosition)
                        ) : (
                          <div className="text-xl font-bold text-muted-foreground">#{globalPosition}</div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {(user.name || "N/A").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{user.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Trophies */}
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-xl font-bold text-foreground">{user.trophyCount.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + usersPerPage, allUsers.length)} of {allUsers.length} users
        </div>
      </div>
    </div>
  )
}
