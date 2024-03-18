import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../aws-exports";
import { useRouter } from "next/navigation";
import { Auth } from "aws-amplify";
import styles from "../styles/Home.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Swal from "sweetalert2";
import apply from "./api/apply";
import { ApplicantList } from "@/models";
import { DataStore } from "@aws-amplify/datastore";

Amplify.configure({ ...awsconfig, ssr: true });

const ADMIN_ROUTE = "/admin";
const APPLICANT_ROUTE = "/applicant";

function Applicant({ signOut, user }) {
  const [jobDetails, setJobDetails] = useState();
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;
  const [state, setState] = useState({
    name: "",
    email: "",
    portfoliourl: "",
    coverletter: " ",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apply(state, jobDetails);
    if (res.success) {
      Swal.fire({
        title: "Application successfully",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/");
        }
      });
    } else {
      console.log(res.error);
    }
    // await DataStore?.save(
    //     new ApplicantList({
    //         Name: `${state?.name}`,
    //         Email: `${state?.email}`,
    //         Message: `${state?.coverletter}`,
    //         PortfolioLink: `${state?.portfoliourl}`,
    //         Status: ``,
    //         JobID: `${jobdetails?.id}`,
    //     })
    // ).then(savedItem => {
    //     // console.log('Item saved successfully:', savedItem);
    //     Swal.fire({
    //         title: "Application successfully",
    //         showConfirmButton: true,
    //         confirmButtonText: "Ok",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             router.push("/");
    //         }
    //     });
    // }).catch(error => {
    //     console.error('Error saving item:', error);
    // })
  };

  const HandleLogout = () => {
    signOut();
    router.push("/");
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((user) => {
        if (user.attributes.email === adminEmail) {
          router.push(ADMIN_ROUTE);
        } else if (
          user.attributes.email !== adminEmail &&
          user.attributes.email
        ) {
          router.push(APPLICANT_ROUTE);
        } else {
          router.push("/");
        }
      })
      .catch((err) => console.log(err));

    if (typeof window !== "undefined") {
      let newObject = localStorage.getItem("apply-data");
      setJobDetails(JSON.parse(newObject));
    }
  }, []);

  return (
    <div>
      <div className={styles.home_container}>
        <Navbar />

        <div className="container">
          <button
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => HandleLogout()}
          >
            Sign out
          </button>

          <div className="row">
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  required
                  id="name"
                  name="name"
                  value={state.name}
                  onChange={handleInputChange}
                />

                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  required
                  id="email"
                  name="email"
                  value={state.email}
                  onChange={handleInputChange}
                />

                <label htmlFor="portfolioUrl">Portfolio Url:</label>
                <input
                  type="text"
                  required
                  id="portfolioUrl"
                  name="portfolioUrl"
                  value={state.portfolioUrl}
                  onChange={handleInputChange}
                />

                <label htmlFor="coverLetter">Cover letter:</label>
                <textarea
                  id="coverLetter"
                  required
                  name="coverLetter"
                  value={state.coverLetter}
                  onChange={handleInputChange}
                ></textarea>
                <input type="submit" value="Submit" />
              </form>
            </div>
            <div className="col-md-6">
              <div>
                <h2>Job Details</h2>
                <ul>
                  <li>Job Position: {jobDetails?.JobPosition}</li>
                  <li>Job Details: {jobDetails?.Description}</li>
                  <li>Location: {jobDetails?.Location}</li>
                  <li>Experience: {jobDetails?.Experience}</li>
                  <li>Job Status: {jobDetails?.JobStatus}</li>
                  <li>Description: {jobDetails?.Description}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(Applicant);
