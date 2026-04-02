import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
