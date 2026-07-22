"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { DeskShell, MobileShell } from "@/components/shell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const segment = pathname.split("/")[1]; // admin | encargado | repartidor

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (segment && segment !== user.role) {
      router.replace(`/${user.role}`);
    }
  }, [user, loading, segment, router]);

  if (loading || !user || segment !== user.role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (user.role === "repartidor") {
    return <MobileShell user={user}>{children}</MobileShell>;
  }
  return <DeskShell user={user}>{children}</DeskShell>;
}
