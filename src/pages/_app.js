import "@/styles/globals.css";
import { Amplify } from "aws-amplify";
import config from "../../src/amplifyconfiguration.json";
Amplify.configure(config);
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
