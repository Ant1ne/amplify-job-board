import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../../src/amplifyconfiguration.json";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

Amplify.configure({ ...config, ssr: true });

function AuthAccount() {
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;
  const ADMIN_ROUTE = "/admin";
  const APPLICANT_ROUTE = "/applicant";

  useEffect(() => {
    async function handleAuthentication() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.attributes.role === "admin") {
          router.push(ADMIN_ROUTE);
        } else {
          router.push(APPLICANT_ROUTE);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }

    handleAuthentication();
  }, []);

  return null;
}

export default withAuthenticator(AuthAccount);
