import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../aws-exports";
import { useRouter } from "next/navigation";
import { Auth } from "aws-amplify";
import styles from "../styles/Home.module.css";
import { DataStore } from "@aws-amplify/datastore";
import Image from "next/image";
import Swal from "sweetalert2";
import NavBar from "../components/NavBar/NavBar";
import addNewJob from "./api/addNewJob";

Amplify.configure({ ...awsconfig, ssr: true });

const APPLICANT_ROUTE = "/applicant";

async function getData() {
  try {
    const res = await DataStore?.query(ApplicantList);
    return res;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
}

function Admin({ signOut, user }) {
  const [data, setData] = useState([]);
  const router = useRouter();
  const adminEmail = process.env.ADMIN_EMAIL;
  const [jobPosition, setJobPosition] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [agency, setAgency] = useState("");
  const [description, setDescription] = useState("");

  const handleJobPositionChange = (event) => {
    setJobPosition(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleJobStatusChange = (event) => {
    setJobStatus(event.target.value);
  };

  const handleAgencyChange = (event) => {
    setAgency(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const HandleLogout = () => {
    signOut();
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addNewJob({
        jobPosition,
        Category: category,
        Location: location,
        Experience: experience,
        JobStatus: jobStatus,
        Agency: agency,
        Description: description,
      });
      Swal.fire({
        title: "Application successfully",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      })
        .then((result) => {
          if (result.isConfirmed) {
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error saving item:", error);
        });

      if (res.success) {
        Swal.fire({
          title: "Job added successfully",
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((user) => {
        if (user.attributes.email !== adminEmail) {
          router.push(APPLICANT_ROUTE);
        }
      })
      .catch((err) => console.log(err));

    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.home_container}>
        <NavBar />
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

          <div
            className="row"
            style={{
              marginTop: "50px",
            }}
          >
            <div className="col-md-6">
              <h1>Add JOB</h1>

              <form onSubmit={handleSubmit}>
                <label htmlFor="jobPosition">Job position:</label>
                <input
                  type="text"
                  required
                  id="jobPosition"
                  name="jobPosition"
                  value={jobPosition}
                  onChange={handleJobPositionChange}
                />

                <label htmlFor="Category">Category:</label>
                <input
                  type="text"
                  required
                  id="Category"
                  name="Category"
                  value={category}
                  onChange={handleCategoryChange}
                />

                <label htmlFor="Location">Location:</label>
                <input
                  type="text"
                  required
                  id="Location"
                  name="Location"
                  value={location}
                  onChange={handleLocationChange}
                />

                <label htmlFor="Experience">Experience:</label>
                <input
                  type="text"
                  id="Experience"
                  required
                  name="Experience"
                  value={experience}
                  onChange={handleExperienceChange}
                />

                <label htmlFor="JobStatus">Job Status:</label>
                <input
                  type="text"
                  id="JobStatus"
                  required
                  name="JobStatus"
                  value={jobStatus}
                  onChange={handleJobStatusChange}
                />

                <label htmlFor="Agency">Agency:</label>
                <input
                  type="text"
                  id="Agency"
                  required
                  name="Agency"
                  value={agency}
                  onChange={handleAgencyChange}
                />

                <label htmlFor="Description">Description:</label>
                <input
                  type="text"
                  id="Description"
                  required
                  name="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                />

                <input type="submit" value="Submit" />
              </form>
            </div>

            <div className="col-md-6">
              <div>
                <h2>Applications</h2>

                {
                  <section className="items-section">
                    <div className="items-container">
                      {data?.map((x, i) => {
                        return (
                          <div key={i}>
                            <div className="item-card">
                              <Image
                                src="https://picsum.photos/id/20/500/300"
                                width={500}
                                height={200}
                                alt="item"
                              />
                              <h2>JOB ID {x.JobID}</h2>
                              <p>Email: {x?.Email}</p>
                              <p>Name: {x?.Name}</p>
                              <p>Portfolio Url: {x?.PortfolioLink}</p>
                              <p>Experience: {""}</p>
                              <textarea
                                placeholder="cover-letter"
                                name="coverletter"
                                value={x?.Message}
                                id=""
                                cols="20"
                                rows="5"
                              ></textarea>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "20px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    localStorage.setItem(
                                      "apply-data",
                                      JSON.stringify(x)
                                    );
                                    Swal.fire({
                                      title:
                                        "Application approved successfully",
                                      showConfirmButton: true,
                                      confirmButtonText: "Ok",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        router.push("/");
                                      }
                                    });
                                  }}
                                  style={{
                                    backgroundColor: "green",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => {
                                    localStorage.setItem(
                                      "apply-data",
                                      JSON.stringify(x)
                                    );
                                    Swal.fire({
                                      title: "Rejected",
                                      showConfirmButton: true,
                                      confirmButtonText: "Ok",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        router.push("/");
                                      }
                                    });
                                  }}
                                  style={{
                                    backgroundColor: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withAuthenticator(Admin);
