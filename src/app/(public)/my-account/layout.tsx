import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import SideBar from "./_components/sidebar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <main className="flex h-full w-full justify-center bg-dash-background-primary">
      <div className="flex h-full w-full max-w-[1200px] flex-col gap-6 p-6 pt-12">
        <header className="px-4 py-6">
          <h1 className="text-3xl font-semibold">My Account</h1>
        </header>
        <div className="flex gap-6">
          <SideBar />

          {children}
        </div>
      </div>
    </main>
  );
}
