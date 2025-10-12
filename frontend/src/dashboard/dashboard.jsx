"use client"
import React, { useState, useEffect, useRef } from "react"
import axios, { AxiosError } from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { useToast } from "../components/ui/use-toast"
import { DoorOpen as Door, LogOut, Plus, Trash2, Users } from "lucide-react"
// import { ThemeToggle } from "../components/theme-toggle"
import { useAuth } from "../lib/auth"
import AuthGuard from "../components/AuthGuard"
import { BACKEND_URL } from "../config"

import { SiExcalidraw } from "react-icons/si"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [rooms, setRooms] = useState([])
  const [newRoomName, setNewRoomName] = useState("")
  const [joinRoomName, setJoinRoomName] = useState("")
  const [loading, setLoading] = useState(true)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { logout, token, setToken } = useAuth()
  const joinRef = useRef(null)
  const createRef = useRef(null)
  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in")
    } else {
      fetchRooms()
    }
  }, [token])

  const fetchRooms = async () => {
    try {
      const url = `${BACKEND_URL}/user/rooms`
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = res.data

      setRooms(data.rooms.length > 0 ? data.rooms : [])
    } catch (error) {
      //{"error":"Invalid or expired token."}
      if (error instanceof AxiosError) {
        if (error.status == 401) {
          setToken("")

          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "Please Login Again"
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch rooms"
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async () => {
    try {
      const url = `${BACKEND_URL}/room/create/${newRoomName}`
      const res = await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = res.data
      if (!data.room) {
        throw new Error("Room creation failed")
      }
      setRooms([data.room, ...rooms])
      setNewRoomName("")
      toast({
        title: "Success",
        description: "Room created successfully"
      })
    } catch (error) {
      setNewRoomName("")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Room with same name already Exists"
      })
    }
  }

  const joinRoom = async roomname => {
    try {
      const url = `${BACKEND_URL}/room/join/${
        joinRoomName == "" ? roomname : joinRoomName
      }`
      const res = await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = res.data
      console.log(data)
      if (!data.room) {
        throw new Error("Room not found")
      }
      setJoinRoomName("")
      toast({
        title: "Success",
        description: "Joined room successfully"
      })
      sessionStorage.getItem("hasReloaded")
      sessionStorage.setItem("hasReloaded", "false")
      navigate(`/canvas/${data.room.id}`)
    } catch (error) {
      setJoinRoomName("")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Room not found"
      })
    }
  }

  // Delete room function with fixed filtering logic.
  const deleteRoom = async roomId => {
    try {
      const url = `${BACKEND_URL}/room/${roomId}`
      const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res) {
        throw new Error("Error deleting room")
      }
      if (res.data.msg === "Room not found ") {
        throw new Error("Error deleting room")
      }
      // Remove only the deleted room from the list:
      setRooms(rooms.filter(room => room.id !== roomId))
      toast({
        title: "Success",
        description: "Room deleted successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete room"
      })
    }
  }

  const handleSignOut = async () => {
    navigate("/")
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading your rooms...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href={"/"} className="transition-transform hover:scale-105">
              <div className="flex items-center space-x-3">
                
                <span className="text-2xl font-bold text-gray-900">CollabBoard</span>
              </div>
            </a>
            <div className="flex items-center space-x-4">
              {/* <ThemeToggle /> */}
              <button 
                onClick={handleSignOut}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-12">
          {/* Header and Create/Join buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Rooms</h1>
              <p className="text-gray-600">Create and manage your collaborative spaces</p>
            </div>
            <div className="flex gap-3">
              {/* Create Room Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5">
                    <Plus className="h-4 w-4" />
                    Create Room
                  </button>
                </DialogTrigger>
                <DialogContent
                  onKeyDown={e => {
                    if (e.key == "Enter") {
                      if (createRef.current instanceof HTMLElement) {
                        createRef.current.click()
                      }
                    }
                  }}
                  className="rounded-2xl"
                >
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Room</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enter a name for your new room.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Room name"
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                    className="px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <button
                        ref={createRef}
                        onClick={createRoom}
                        disabled={!newRoomName.trim()}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Join Room Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                    <Door className="h-4 w-4" />
                    Join Room
                  </button>
                </DialogTrigger>
                <DialogContent
                  onKeyDown={e => {
                    if (e.key == "Enter") {
                      if (joinRef.current instanceof HTMLElement) {
                        joinRef.current.click()
                      }
                    }
                  }}
                  className="rounded-2xl"
                >
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Join Room</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enter the name of the room you want to join.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Room name"
                    value={joinRoomName}
                    onChange={e => setJoinRoomName(e.target.value)}
                    className="px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <button
                        ref={joinRef}
                        onClick={() => {
                          joinRoom()
                        }}
                        disabled={!joinRoomName.trim()}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Join
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Rooms List */}
          {rooms.length === 0 ? (
            <Card className="border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  No rooms created yet
                </p>
                <p className="text-sm text-gray-600">
                  Create your first room to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map(room => (
                <Card key={room.id} className="border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">{room.slug}</CardTitle>
                    <CardDescription className="text-gray-600">
                      Created on {new Date(room.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          joinRoom(room.slug)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Door className="h-4 w-4" />
                        Join Room
                      </button>
                      <button
                        onClick={() => setRoomToDelete(room.id)}
                        className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Confirmation Dialog for Deletion */}
        {roomToDelete && (
          <Dialog
            open
            onOpenChange={open => {
              if (!open) setRoomToDelete(null)
            }}
          >
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to delete this room? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <button 
                    onClick={() => setRoomToDelete(null)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  onClick={() => {
                    if (roomToDelete) {
                      deleteRoom(roomToDelete)
                    }
                    setRoomToDelete(null)
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Delete
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AuthGuard>
  )
}