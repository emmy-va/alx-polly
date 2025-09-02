"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuth: React.FC<P> = (props) => {
    const { session } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!session) {
        router.push("/login");
      }
    }, [session, router]);

    if (!session) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
