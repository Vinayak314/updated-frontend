"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, Edit, Save, Eye, EyeOff, Home } from "lucide-react" // Importing Eye and EyeOff icons

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string
    email: string
    username: string
    phone: string
    country: string
    id: number
    user_type: string
    password: string
    business_details: {
      gst_number: string
      pan_number: string
      iec: string
    }
  } | null>(null)
  const [newPassword, setNewPassword] = useState("")

  // Fetch user data from localStorage when the component loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored User:", parsedUser);
      setUser(parsedUser); // Set the user data directly from localStorage
      setLoading(false);
    } else {
      window.location.href = "/login"; // Redirect to login if no user found in localStorage
    }
  }, [])

  // Handle input change to update user state
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (user) {
      setUser({
        ...user,
        [field]: e.target.value,
      })
    }
  }

  // Handle business details change
  const handleBusinessInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (user?.business_details) {
      setUser({
        ...user,
        business_details: {
          ...user.business_details,
          [field]: e.target.value,
        }
      })
    }
  }

  // Toggle editing state
  const toggleEditing = () => {
    setIsEditing(prev => !prev)
  }

  // Save updated profile to the database
  const handleSave = async () => {
    if (user) {
      try {
        // Save the updated user data in local storage
        const updatedUser = { ...user, password: newPassword || undefined };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("Stored User:", updatedUser);
        // Make a PUT or POST request to send the updated data to your backend
        const response = await axios.put('https://zecbay-backend.vercel.app/api/user/profile-update/', user);

        // Handle the response from the backend
        if (response.status === 200) {
            setIsEditing(false); // Close the editing mode
            alert("Profile updated successfully!"); // Show a success message
        } else {
            alert("Something went wrong. Please try again later.");
        }
        } catch (error) {
        console.error("Error saving profile data", error);
        alert("Error saving profile data. Please try again.");
        }
    }
  }

  const handleDashboardClick = () => {
    window.location.href = "/dashboard";    // Redirect to dashboard
  }

  if (loading || !user) {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50">
          <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
        </div>
      );
    }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={toggleEditing}
                className="flex items-center gap-2"
              >
                {isEditing ? <Check className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                {isEditing ? "Save" : "Edit Profile"}
              </Button>
              <Button
                  variant="outline"
                  onClick={handleDashboardClick} // Add click handler for Dashboard
                  className="flex items-center gap-2"
                >
                  <Home className="h-5 w-5" /> {/* Home icon for dashboard */}
                  Dashboard
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Personal Details</h3>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user.username || ""}
                  onChange={(e) => handleInputChange(e, "username")}
                  disabled={true} // Make username read-only
                />
              </div>
              <div>
                <Label htmlFor="userid">UserID</Label>
                <Input
                  id="userid"
                  value={user.id || ""}
                  onChange={(e) => handleInputChange(e, "userid")}
                  disabled={true} // Make username read-only
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  onChange={(e) => handleInputChange(e, "email")}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={user.phone || ""}
                  onChange={(e) => handleInputChange(e, "phone")}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={user.country || ""}
                  disabled={true}
                />
              </div>
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Input
                  id="userType"
                  value={user.user_type === "exporter" ? "Indian Exporter" : "Importer"}
                  disabled={true}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={isEditing ? newPassword : passwordVisible ? user.password : "•".repeat(user.password?.length || 1)}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Leave empty to keep current password" : ""}
                  />
                  <Button
                    type="button"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    variant="outline"
                    className="p-2"
                  >
                    {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold">Business Details</h3>

              {user.user_type.toLowerCase() === "exporter" && (
                <>
                <div>
                    <Label htmlFor="gst_number">GST Number</Label>
                    <Input
                    id="gst_number"
                    value={user.business_details?.gst_number || ""}
                    onChange={(e) => handleBusinessInputChange(e, "gst_number")}
                    disabled={true}
                    />
                </div>
                <div>
                    <Label htmlFor="pan_number">PAN Number</Label>
                    <Input
                    id="pan_number"
                    value={user.business_details?.pan_number || ""}
                    onChange={(e) => handleBusinessInputChange(e, "pan_number")}
                    disabled={true}
                    />
                </div>
                </>
              )}

              <div>
                <Label htmlFor="iec">Import Export Code</Label>
                <Input
                  id="iec"
                  value={user.business_details?.iec || ""}
                  onChange={(e) => handleBusinessInputChange(e, "iec")}
                  disabled={true}
                />
              </div>
            </div>
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
