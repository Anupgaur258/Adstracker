"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, logout, profilePhoto, setProfilePhoto, updateProfile } = useAuthStore();
  const hydrated = useHydration();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentPwError, setCurrentPwError] = useState("");
  const [newPwError, setNewPwError] = useState("");

  const initialized = useRef(false);
  if (hydrated && user && !initialized.current) {
    initialized.current = true;
    setName(user.name);
    setEmail(user.email);
  }

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const validateName = (v: string) => {
    if (!v.trim()) { setNameError("Name is required"); return false; }
    if (/[0-9]/.test(v)) { setNameError("Numbers are not allowed in name"); return false; }
    if (/[^a-zA-Z\s'-]/.test(v.trim())) { setNameError("Special characters are not allowed"); return false; }
    if (v.trim().length < 2) { setNameError("At least 2 characters required"); return false; }
    if (v.trim().length > 50) { setNameError("Name cannot exceed 50 characters"); return false; }
    setNameError(""); return true;
  };

  const validateEmail = (v: string) => {
    if (!v.trim()) { setEmailError("Email is required"); return false; }
    if (/\s/.test(v)) { setEmailError("Email cannot contain spaces"); return false; }
    if (!v.includes("@")) { setEmailError("Email must contain @"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) { setEmailError("Enter a valid email (e.g. user@example.com)"); return false; }
    setEmailError(""); return true;
  };

  const validateCurrentPw = (v: string) => {
    if (newPassword && !v) { setCurrentPwError("Enter current password to change"); return false; }
    if (v && v.length < 6) { setCurrentPwError("Password must be at least 6 characters"); return false; }
    setCurrentPwError(""); return true;
  };

  const validateNewPw = (v: string) => {
    if (currentPassword && !v) { setNewPwError("Enter a new password"); return false; }
    if (v && v.length < 6) { setNewPwError("At least 6 characters required"); return false; }
    if (v && !/[A-Z]/.test(v)) { setNewPwError("Must include at least one uppercase letter"); return false; }
    if (v && !/[a-z]/.test(v)) { setNewPwError("Must include at least one lowercase letter"); return false; }
    if (v && !/[0-9]/.test(v)) { setNewPwError("Must include at least one number"); return false; }
    if (v && v === currentPassword) { setNewPwError("New password must be different from current"); return false; }
    setNewPwError(""); return true;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const base64 = await fileToBase64(file);
    setProfilePhoto(base64);
    toast.success("Profile photo saved");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSave = () => {
    const n = validateName(name);
    const e = validateEmail(email);
    const cp = validateCurrentPw(currentPassword);
    const np = validateNewPw(newPassword);
    if (!n || !e || !cp || !np) return;

    updateProfile({ name: name.trim(), email: email.trim() });

    if (currentPassword && newPassword) {
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile and password updated");
    } else {
      toast.success("Profile saved");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile information.</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Photo */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-border">
              {profilePhoto ? (
                <AvatarImage src={profilePhoto} alt={user?.name ?? "User"} />
              ) : null}
              <AvatarFallback className="bg-brand-purple/20 text-brand-purple text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{user?.name ?? "User"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-brand-purple hover:underline mt-1 cursor-pointer"
            >
              Change photo
            </button>
          </div>
        </div>
      </div>

      {/* Details + Password */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); validateName(e.target.value); }}
              placeholder="Enter your name"
              className={`bg-muted ${nameError ? "border-red-500 focus:border-red-500" : "border-border"}`}
            />
            {nameError && <p className="text-xs text-red-400">{nameError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
              placeholder="Enter your email"
              className={`bg-muted ${emailError ? "border-red-500 focus:border-red-500" : "border-border"}`}
            />
            {emailError && <p className="text-xs text-red-400">{emailError}</p>}
          </div>
        </div>

        <Separator className="bg-border" />

        <h2 className="font-semibold text-foreground">Change Password</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); validateCurrentPw(e.target.value); }}
              placeholder="••••••••"
              className={`bg-muted ${currentPwError ? "border-red-500 focus:border-red-500" : "border-border"}`}
            />
            {currentPwError && <p className="text-xs text-red-400">{currentPwError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); validateNewPw(e.target.value); }}
              placeholder="••••••••"
              className={`bg-muted ${newPwError ? "border-red-500 focus:border-red-500" : "border-border"}`}
            />
            {newPwError && <p className="text-xs text-red-400">{newPwError}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gradient-bg text-foreground border-0 hover:opacity-90">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Log Out</h2>
            <p className="text-sm text-muted-foreground">Sign out of your account.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
