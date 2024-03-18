import "@aws-amplify/ui-react/styles.css";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../aws-exports";
import { useRouter } from "next/navigation";
import { Auth } from "aws-amplify";
import { result } from "lodash";

const ADMIN_ROUTE = "/admin";
const APPLICANT_ROUTE = "/applicant";

Amplify.configure({ ...awsconfig, ssr: true });

function AuthAccount({ user }) {
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((result) => {
        if (user.attributes.email === adminEmail) {
          router.push(ADMIN_ROUTE);
        } else {
          router.push(APPLICANT_ROUTE);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);

  return null;
}

export default withAuthenticator(AuthAccount);
