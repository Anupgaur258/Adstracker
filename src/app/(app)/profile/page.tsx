"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, LogOut } from "lucide-react";
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
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const initialized = useRef(false);
  if (hydrated && user && !initialized.current) {
    initialized.current = true;
    setName(user.name);
    setEmail(user.email);
  }

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
      setNameError("Name can only contain letters, spaces, hyphens and apostrophes");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError) validateName(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) validateEmail(value);
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
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    if (!isNameValid || !isEmailValid) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    toast.success("Profile saved");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile information.</p>
      </div>

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

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => validateName(name)}
              className={`bg-muted ${nameError ? "border-red-500 focus:border-red-500" : "border-border"}`}
              placeholder="Enter your name"
            />
            {nameError && <p className="text-xs text-red-400">{nameError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => validateEmail(email)}
              className={`bg-muted ${emailError ? "border-red-500 focus:border-red-500" : "border-border"}`}
              placeholder="Enter your email"
            />
            {emailError && <p className="text-xs text-red-400">{emailError}</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gradient-bg text-white border-0 hover:opacity-90">
            Save Changes
          </Button>
        </div>
      </div>

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
