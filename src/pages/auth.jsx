import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../../src/amplifyconfiguration.json";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

Amplify.configure({ ...config, ssr: true });

function AuthAccount({ signOut, user }) {
  const router = useRouter();
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();

        setUser({
          isLoggedIn: true,
          userId: userId,
          email: signInDetails?.loginId || null, // Assuming loginId is the email
        });
      } catch (error) {
        console.log('Error getting current authenticated user:', error);
        if (user.isLoggedIn) {
          setUser({
            isLoggedIn: false,
            userId: null,
            email: null,
          });
        }
      }
    };
    checkCurrentUser();
  }, [user]);
}

export default withAuthenticator(AuthAccount);
