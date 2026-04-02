"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme-store";
import { Coins, LogOut, User, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const { user, logout, profilePhoto } = useAuthStore();
  const { balance } = useCreditsStore();
  const { theme, toggleTheme } = useThemeStore();
  const hydrated = useHydration();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <h1 className="text-sm font-medium text-muted-foreground hidden md:block">
          Welcome back{hydrated && user ? `, ${user.name}` : ""}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {hydrated && theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Badge variant="secondary" className="gap-1.5 bg-brand-purple/10 text-brand-purple border-brand-purple/20 hover:bg-brand-purple/15">
          <Coins className="h-3.5 w-3.5" />
          {hydrated ? balance : "..."} credits
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-purple/50" />}
          >
            <Avatar className="h-8 w-8 border border-border">
              {hydrated && profilePhoto ? (
                <AvatarImage src={profilePhoto} alt={user?.name ?? ""} />
              ) : null}
              <AvatarFallback className="bg-brand-purple/20 text-brand-purple text-sm">
                {hydrated && user ? user.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
