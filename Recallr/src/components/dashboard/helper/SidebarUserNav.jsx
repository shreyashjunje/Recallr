// src/components/sidebar-user-nav.jsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function SidebarUserNav({ trigger, user }) {

  const { logout } = useAuth();
  // Ensure trigger is a single valid React element
  const triggerElement =
    React.isValidElement(trigger) ? trigger : (
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} alt={user?.userName} />
          <AvatarFallback>
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{user?.userName || "User"}</span>
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {triggerElement}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>
          <div className="font-medium">{user?.userName || "Guest"}</div>
          <div className="text-xs text-muted-foreground">
            {user?.email || "No email"}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span onClick={logout}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
