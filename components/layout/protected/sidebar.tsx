"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tray,
  PaperPlaneTilt,
  Trash,
  CalendarBlank,
  Clock,
  Users,
  ChartBar,
  Plugs,
  Gear,
  SidebarSimple,
  CaretUpDown,
  Plus,
  type Icon,
  ArchiveBoxIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const mailLinks = [
  {
    label: "Inbox",
    href: "/inbox",
    icon: Tray,
  },
  {
    label: "Sent",
    href: "/sent",
    icon: PaperPlaneTilt,
  },
  {
    label: "Drafts",
    href: "/drafts",
    icon: ArchiveBoxIcon,
  },
  {
    label: "Trash",
    href: "/trash",
    icon: Trash,
  },
];

const calendarLinks = [
  {
    label: "Calendar",
    href: "/calendar",
    icon: CalendarBlank,
  },
  {
    label: "Today",
    href: "/calendar/today",
    icon: Clock,
  },
];

const workflowLinks = [
  {
    label: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: ChartBar,
  },
  {
    label: "Integrations",
    href: "/integrations",
    icon: Plugs,
  },
];

const Sidebar = () => {
  const [isClosed, setIsClosed] = useState(false);
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col px-3 py-3 transition-all duration-300",
        isClosed ? "w-[72px]" : "w-[220px]"
      )}
    >
      {/* Header */}
      <div className="flex h-10 items-center justify-between">
        <Link href="/inbox" className={cn("flex items-center ", !isClosed && "gap-2")}>
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={36}
            height={36}
            className="size-9 rounded-xl"
          />

          {!isClosed && (
            <span className="text-sm font-semibold text-foreground">
              Kairo
            </span>
          )}
        </Link>

        {!isClosed && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <CaretUpDown size={16} />

            <button
              type="button"
              onClick={() => setIsClosed(true)}
              className="rounded-md p-1 hover:bg-black/5"
            >
              <SidebarSimple size={18} />
            </button>
          </div>
        )}

        {isClosed && (
          <button
            type="button"
            onClick={() => setIsClosed(false)}
            className="absolute -right-3 top-20 rounded-md border bg-background p-1 shadow-sm hover:bg-muted"
          >
            <SidebarSimple size={18} />
          </button>
        )}
      </div>

      {/* Compose Button */}
      <div className="mt-5">
        <Link
          href="/compose"
          className={cn(
            "flex items-center gap-2 rounded-xl bg-foreground px-3 py-2.5 text-sm font-medium text-background transition hover:opacity-90",
            isClosed && "justify-center px-2"
          )}
        >
          <Plus size={18} weight="bold" />

          {!isClosed && <span>Compose</span>}
        </Link>
      </div>

      {/* Mail */}
      <SidebarSection title="Mail" isClosed={isClosed}>
        {mailLinks.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isClosed={isClosed}
            active={isActive(item.href)}
          />
        ))}
      </SidebarSection>

      {/* Calendar */}
      <SidebarSection title="Calendar" isClosed={isClosed}>
        {calendarLinks.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isClosed={isClosed}
            active={isActive(item.href)}
          />
        ))}
      </SidebarSection>

      {/* Workflow */}
      <SidebarSection title="Workflow Tools" isClosed={isClosed}>
        {workflowLinks.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isClosed={isClosed}
            active={isActive(item.href)}
          />
        ))}
      </SidebarSection>

      {/* Bottom */}
      <div className="mt-auto space-y-3 border-t pt-3">
        <SidebarItem
          href="/settings"
          icon={Gear}
          label="Settings"
          isClosed={isClosed}
          active={isActive("/settings")}
        />

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl p-2",
            isClosed && "justify-center"
          )}
        >
          <div className="relative shrink-0">
            <Image
              src={user?.image || "/avatar.png"}
              alt="User"
              width={36}
              height={36}
              className="size-9 rounded-xl object-cover"
            />

            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-green-500" />
          </div>

          {!isClosed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.name || "Anas Nadkar"}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "anas@example.com"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

type SidebarSectionProps = {
  title: string;
  isClosed: boolean;
  children: React.ReactNode;
};

const SidebarSection = ({ title, isClosed, children }: SidebarSectionProps) => {
  return (
    <nav className="mt-6 space-y-1">
      {!isClosed && (
        <p className="mb-2 px-2 text-xs text-muted-foreground">{title}</p>
      )}

      {children}
    </nav>
  );
};

type SidebarItemProps = {
  href: string;
  icon: Icon;
  label: string;
  active?: boolean;
  isClosed: boolean;
};

const SidebarItem = ({
  href,
  icon: Icon,
  label,
  active,
  isClosed,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      title={isClosed ? label : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition hover:bg-black/5 hover:text-foreground",
        active && "bg-black/5 text-foreground",
        isClosed && "justify-center px-2"
      )}
    >
      <Icon
        size={18}
        weight={active ? "fill" : "duotone"}
        className="shrink-0"
      />

      {!isClosed && <span>{label}</span>}
    </Link>
  );
};