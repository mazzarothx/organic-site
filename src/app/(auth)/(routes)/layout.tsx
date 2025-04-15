import { redirect } from "next/navigation";
import { auth } from "../auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return (
      <div className="bg-io-background-extreme flex max-h-screen min-h-screen">
        <div className="flex h-screen w-full items-center justify-center sm:w-[50%]">
          {children}
        </div>
        <div className="bg-io-background-secondary hidden h-screen w-[50%] sm:block">
          <div className="h-full w-full bg-red-500/30" />
          {/* <Image
            src="/login.jpeg"
            width={1000}
            height={1000}
            alt="Logomarca 99boost"
            className="h-full w-full object-cover"
          /> */}
        </div>
      </div>
    );
  }

  if (session.user.role === "ADMIN") {
    redirect("/");
  } else {
    redirect("/");
  }
}
