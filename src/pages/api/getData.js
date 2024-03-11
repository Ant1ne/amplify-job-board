import { DataStore } from "@aws-amplify/datastore";
import { JobList } from "../../../backend/backend/models";

async function getData() {
  const res = await DataStore.query(JobList);
  return res;
}

export default getData;
