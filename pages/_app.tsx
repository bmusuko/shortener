import "../styles/globals.css";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "linear-gradient(0deg, #0f2027 0%, #203a43 50%, #0f2027 100%)",
    color: "white",
    height: "100vh",
    width: "100vw",
  },
}));

function MyApp({ Component, pageProps }) {
  const classes = useStyles();
  return (
    <Paper square className={classes.root}>
      <Component {...pageProps} />
    </Paper>
  );
}

export default MyApp;
