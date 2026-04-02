"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState, useRef } from "react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const hydrated = useHydration();

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
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) { setNameError("Only letters, spaces, hyphens and apostrophes"); return false; }
    if (v.trim().length < 2) { setNameError("At least 2 characters"); return false; }
    setNameError(""); return true;
  };

  const validateEmail = (v: string) => {
    if (!v.trim()) { setEmailError("Email is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) { setEmailError("Enter a valid email"); return false; }
    setEmailError(""); return true;
  };

  const validateCurrentPw = (v: string) => {
    if (newPassword && !v) { setCurrentPwError("Enter current password to change"); return false; }
    setCurrentPwError(""); return true;
  };

  const validateNewPw = (v: string) => {
    if (currentPassword && !v) { setNewPwError("Enter a new password"); return false; }
    if (v && v.length < 6) { setNewPwError("At least 6 characters"); return false; }
    if (v && !/[A-Z]/.test(v)) { setNewPwError("Include at least one uppercase letter"); return false; }
    if (v && !/[0-9]/.test(v)) { setNewPwError("Include at least one number"); return false; }
    setNewPwError(""); return true;
  };

  const handleSave = () => {
    const n = validateName(name);
    const e = validateEmail(email);
    const cp = validateCurrentPw(currentPassword);
    const np = validateNewPw(newPassword);
    if (!n || !e || !cp || !np) return;

    updateProfile({ name: name.trim(), email: email.trim() });
    setCurrentPassword("");
    setNewPassword("");
    toast.success("Settings saved");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h2 className="font-semibold text-foreground">Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) validateName(e.target.value); }}
              onBlur={() => validateName(name)}
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
              onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
              onBlur={() => validateEmail(email)}
              placeholder="Enter your email"
              className={`bg-muted ${emailError ? "border-red-500 focus:border-red-500" : "border-border"}`}
            />
            {emailError && <p className="text-xs text-red-400">{emailError}</p>}
          </div>
        </div>

        <Separator className="bg-border" />

        <h2 className="font-semibold text-foreground">Password</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); if (currentPwError) validateCurrentPw(e.target.value); }}
              onBlur={() => validateCurrentPw(currentPassword)}
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
              onChange={(e) => { setNewPassword(e.target.value); if (newPwError) validateNewPw(e.target.value); }}
              onBlur={() => validateNewPw(newPassword)}
              placeholder="••••••••"
              className={`bg-muted ${newPwError ? "border-red-500 focus:border-red-500" : "border-border"}`}
            />
            {newPwError && <p className="text-xs text-red-400">{newPwError}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="gradient-bg text-white border-0 hover:opacity-90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
