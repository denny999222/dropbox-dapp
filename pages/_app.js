import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // THIS FILE gets executed on the server side AND client side
  // console.log("This will print on client and server side")
  return <Component {...pageProps} />;
}

export default MyApp;
