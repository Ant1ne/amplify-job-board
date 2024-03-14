import { Amplify } from "aws-amplify";
import config from "../../src/amplifyconfiguration.json";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar/NavBar";
import JobDetails from "@/components/JobDetails/JobDetails";
import getData from "./api/getData";

Amplify.configure({ ...config, ssr: true });

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, [data]);

  return (
    <div className={styles.home_container}>
      <NavBar />
      {data && <JobDetails data={data} />}
    </div>
  );
}

export default Home;
