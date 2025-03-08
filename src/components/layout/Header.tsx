import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Search,
  Menu,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Moon,
  Sun,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

const Header = ({
  title = "Data Analysis & Visualization Platform",
  onMenuToggle = () => {},
  onProfileClick = () => {},
  onNotificationsClick = () => {},
  onSettingsClick = () => {},
}: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    // Redirect happens automatically due to auth state change
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userInitials = user?.user_metadata?.full_name
    ? getInitials(user.user_metadata.full_name)
    : "U";

  return (
    <header className="sticky top-0 z-30 w-full h-20 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 md:px-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-xl font-bold hidden md:block">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative mr-2 hidden md:flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search datasets..."
            className="pl-10 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-64 transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleTheme();
              toast({
                title: `${theme === "light" ? "Dark" : "Light"} mode activated`,
                description: `Switched to ${theme === "light" ? "dark" : "light"} theme`,
                duration: 2000,
              });
            }}
            className="relative hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="relative hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 ml-1 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.user_metadata?.full_name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block font-medium text-sm">
                  {user?.user_metadata?.full_name || user?.email || "User"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                My Dashboards
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
