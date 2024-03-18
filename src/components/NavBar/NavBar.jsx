import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";

const NavBar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const { asPath } = useRouter();
  const router = useRouter();

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((result) => {
        setAuthenticated(result);
      })
      .catch((err) => console.log(err));
  }, [asPath]);

  return (
    <div>
      {
        <header
          style={{ backgroundColor: "#fff", color: "#21312a", padding: "1rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() => {
                router.push("/");
              }}
            >
              Amplify Careers
            </h1>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => router.push("/auth")}
                style={{
                  marginRight: "1rem",
                  backgroundColor: "#fff",
                  color: "#21312A",
                  border: "none",
                  padding: "0.5rem 1rem",
                }}
              >
                {authenticated
                  ? "Welcome" + " " + authenticated.attributes.email
                  : "Sign up/Login"}
              </button>
            </div>
          </div>
        </header>
      }
    </div>
  );
};

export default NavBar;
