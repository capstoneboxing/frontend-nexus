"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    Brain,
    ChevronLeft,
    Crown,
    History,
    LayoutDashboard,
    LogIn,
    LogOut,
    Medal,
    Menu,
    Settings,
    SlidersHorizontal,
    Swords,
    Trophy,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUser, isLoggedIn } from "@/lib/auth"

type DashboardLayoutProps = {
    children: React.ReactNode
}

type NavItem = {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    requiresAuth?: boolean
}

const navItems: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Ranked Boxers", href: "/dashboard/boxers", icon: Medal, requiresAuth: true },
    { label: "Perfect Boxers", href: "/dashboard/perfectboxer", icon: Crown, requiresAuth: true },
    { label: "Category Weights", href: "/dashboard/category", icon: SlidersHorizontal, requiresAuth: true },
    { label: "Predict Match", href: "/dashboard/predict", icon: Swords },
    { label: "Prediction History", href: "/dashboard/history", icon: History },
    { label: "Results Analysis", href: "/dashboard/results", icon: BarChart3 },
    { label: "Model Explanation", href: "/dashboard/model", icon: Brain },
    // { label: "Settings", href: "/dashboard/settings", icon: Settings, requiresAuth: true },
]

function isNavItemActive(pathname: string, href: string): boolean {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
}

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
    if (collapsed) {
        return (
            <div className="mx-auto flex size-7 items-center justify-center rounded-md bg-sidebar-primary">
                <Trophy className="size-3.5 text-sidebar-primary-foreground" />
            </div>
        )
    }

    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary">
                <Trophy className="size-3.5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-sidebar-foreground">
        BOXPREDICT
      </span>
        </Link>
    )
}

function SidebarNav({
                        pathname,
                        collapsed,
                        onNavigate,
                        loggedIn,
                        mounted,
                    }: {
    pathname: string
    collapsed: boolean
    onNavigate: () => void
    loggedIn: boolean
    mounted: boolean
}) {
    const visibleItems = navItems.filter((item) => {
        if (!item.requiresAuth) return true
        return mounted && loggedIn
    })

    return (
        <nav className="flex-1 space-y-1 p-3">
            {visibleItems.map((item) => {
                const active = isNavItemActive(pathname, item.href)
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                                ? "bg-sidebar-accent text-sidebar-primary"
                                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                    >
                        <Icon className="size-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                )
            })}
        </nav>
    )
}

function SidebarFooter({
                           collapsed,
                           onNavigate,
                           loggedIn,
                           mounted,
                       }: {
    collapsed: boolean
    onNavigate: () => void
    loggedIn: boolean
    mounted: boolean
}) {
    const href = mounted && loggedIn ? "/logout" : "/login"
    const label = mounted && loggedIn ? "Logout" : "Login"
    const Icon = mounted && loggedIn ? LogOut : LogIn

    return (
        <div className="border-t border-sidebar-border p-3">
            <Link
                href={href}
                onClick={onNavigate}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
            </Link>
        </div>
    )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const loggedIn = mounted ? isLoggedIn() : false
    const user = mounted ? getUser() : null

    const avatarLetter = useMemo(() => {
        return user?.username?.charAt(0).toUpperCase() || ""
    }, [user])

    const closeMobileSidebar = () => setMobileOpen(false)
    const toggleSidebarCollapse = () => setCollapsed((prev) => !prev)

    return (
        <div className="flex h-screen bg-background text-foreground">
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 lg:relative",
                    collapsed ? "w-16" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                    <SidebarLogo collapsed={collapsed} />

                    <button
                        type="button"
                        onClick={closeMobileSidebar}
                        className="text-sidebar-foreground lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <SidebarNav
                    pathname={pathname}
                    collapsed={collapsed}
                    onNavigate={closeMobileSidebar}
                    loggedIn={loggedIn}
                    mounted={mounted}
                />

                <SidebarFooter
                    collapsed={collapsed}
                    onNavigate={closeMobileSidebar}
                    loggedIn={loggedIn}
                    mounted={mounted}
                />

                <div className="hidden border-t border-sidebar-border p-3 lg:block">
                    <button
                        type="button"
                        onClick={toggleSidebarCollapse}
                        className="flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <ChevronLeft
                            className={cn(
                                "size-4 transition-transform",
                                collapsed && "rotate-180"
                            )}
                        />
                    </button>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu className="size-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                            <BarChart3 className="size-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                Boxing Analytics Dashboard
              </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
            </div>
        </div>
    )
}