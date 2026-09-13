import { useState, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MoonMark } from "@/components/MoonMark";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { clearSession } from "@/features/auth/authSlice";
import { logoutRequest } from "@/lib/api";
import { readRefreshToken } from "@/lib/authStorage";
import { notifyError, notifySuccess } from "@/lib/toast";
import { PendingIcon } from "@/components/PendingIcon";

export type DashNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  end?: boolean;
};

export type DashNavGroup = {
  label: string;
  items: DashNavItem[];
};

export function pathTitle(pathname: string): string {
  if (/\/orders\/[^/]+$/.test(pathname)) return "Order details";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (pathname.startsWith("/admin/consults")) return "Consult queue";
  if (pathname.startsWith("/admin/dispatch")) return "Dispatch";
  if (pathname.startsWith("/admin/analytics")) return "Analytics";
  if (pathname.startsWith("/admin/customers")) return "Customers";
  if (pathname.startsWith("/admin/inventory")) return "Inventory";
  if (pathname.startsWith("/admin/team")) return "Team";
  if (pathname.startsWith("/admin")) return "";
  return "";
}

export function isNavActive(pathname: string, to: string, end?: boolean): boolean {
  return end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
}

export function InitialsAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-label={`Avatar ${initials}`}
      className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold", className)}
    >
      {initials}
    </span>
  );
}

export function displayInitials(user?: { initials?: string; name?: string } | null): string {
  const ready = user?.initials?.trim();
  if (ready) return ready.slice(0, 2).toUpperCase();
  const parts = (user?.name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function DashboardShell({ groups, children }: { groups: DashNavGroup[]; children?: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const title = pathTitle(location.pathname);
  const [loggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
    setLoggingOut(true);
    try {
      await logoutRequest(readRefreshToken());
      notifySuccess("Logged out");
    } catch (error) {
      notifyError(error);
    } finally {
      dispatch(clearSession());
      navigate("/");
      setLoggingOut(false);
    }
  };

  const initials = displayInitials(user);

  return (
    <SidebarProvider className="dashboard-root">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to={location.pathname.startsWith("/admin") ? "/admin" : "/account"}>
                  <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <MoonMark />
                  </span>
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="font-semibold">slow mo™</span>
                    <span className="text-xs opacity-70">{user?.role || "account"}</span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isNavActive(location.pathname, item.to, item.end)}
                        tooltip={item.label}
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <div className="flex items-center gap-2 px-2 py-1.5">
            <InitialsAvatar initials={initials} className="bg-sidebar-primary text-sidebar-primary-foreground" />
            <div className="min-w-0 flex-1 text-xs">
              <div className="truncate font-semibold">{user?.name}</div>
              <div className="truncate opacity-70">{user?.email}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mx-2 mb-2" disabled={loggingOut} onClick={() => void logout()}>
            <PendingIcon pending={loggingOut} />
            Log out
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          {title ? <p className="truncate text-xs font-normal text-muted-foreground">{title}</p> : null}
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Home</Link>
            </Button>
            <InitialsAvatar initials={initials} className="bg-primary text-primary-foreground" />
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6 pt-8">{children ?? <Outlet />}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
