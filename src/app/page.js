import AuthenticatedWrapper from "@/components/AuthenticatedWrapper";
import { Dashboard } from "@/components/Dashboard";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full ">
        <AuthenticatedWrapper>
          <Dashboard />
        </AuthenticatedWrapper>
      </div>
    </>
  );
}
