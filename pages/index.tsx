import Head from "next/head";
import {
  Paper,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  InputAdornment,
  CircularProgress,
  IconButton,
  Link,
  withStyles,
} from "@material-ui/core";
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useState } from "react";
import { createShortener } from "../helper/createShortener";
import { ShortenerForm } from "../models/Form";
const buttonWidth = 100;

const GlobalCss = withStyles({
  "@global": {
    ".MuiFilledInput-root": {
      backgroundColor: "#ffffff",
    },
  },
})(() => null);

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(0deg, #0f2027 0%, #203a43 50%, #0f2027 100%)",
    color: "white",
    height: "100vh",
    width: "100vw",
  },
  titleContainer: {
    paddingTop: "4rem",
  },
  inputField: {
    backgroundColor: "#ffffff",
  },
  inputFieldURL: {
    width: `calc(100% - ${buttonWidth}px)`,
  },
  containerFieldURL: {
    minWidth: "350px",
    maxWidth: "1200px",
    padding: "0rem 2rem",
    marginTop: "4rem",
  },
  buttonSubmit: {
    width: `${buttonWidth}px`,
    height: "56px",
    borderRadius: "0px",
  },
  fullWidth: {
    width: "100%",
  },
  gray: {
    backgroundColor: "#888888",
    color: "#888888",
  },
  center: {
    textAlign: "center",
  },
  card: {
    padding: "1rem 2rem",
  },
  inline: {
    display: "inline-block",
  },
});

export default function Home() {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm<ShortenerForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState(null);
  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  const onSubmit = async (data: ShortenerForm) => {
    try {
      setIsLoading(true);
      const response = await createShortener(data);
      setData(response.data);
      console.log(response);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
    }
  };
  return (
    <>
      <Head>
        <title>Short Me!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <GlobalCss />
      <Paper square className={classes.root}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.titleContainer}
          >
            <Grid item xs={12}>
              <Typography component="div" align="center">
                <Box fontSize={64} fontWeight="fontWeightBold">
                  Short Me!
                </Box>
                <Box letterSpacing={4} fontWeight="fontWeightBold">
                  Yet another URL shortener
                </Box>
              </Typography>
            </Grid>

            <Grid item className={classes.containerFieldURL} container>
              <Grid item xs={12} className={classes.fullWidth}>
                <TextField
                  label="URL"
                  InputLabelProps={{ shrink: true }}
                  placeholder="http(s)://"
                  name="URL"
                  inputRef={register({
                    required: {
                      value: true,
                      message: "URL field is required",
                    },
                    pattern: {
                      value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                      message: "Invalid URL, must started with http/https",
                    },
                  })}
                  autoFocus
                  className={clsx(classes.inputField, classes.inputFieldURL)}
                  variant="filled"
                  error={Boolean(errors.URL)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonSubmit}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress /> : "Submit"}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Custom Link (Optional)"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  className={clsx(classes.inputField)}
                  variant="filled"
                  margin="dense"
                  name="custom"
                  inputRef={register({
                    pattern: {
                      value: /^([a-zA-Z0-9_-]+)$/,
                      message:
                        "invalid custom link (alphanumeric/dash/underline)",
                    },
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" className={classes.gray}>
                        {process.env.NEXT_PUBLIC_APP_URI}/
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(errors.URL)}
                />
              </Grid>
            </Grid>
            {data && (
              <Grid item xs={12} sm={12} className={classes.containerFieldURL}>
                <Card
                  className={clsx(classes.fullWidth, classes.card)}
                  elevation={4}
                  square
                >
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      <Typography variant="body1">{data.real_link}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.inline} variant="body1">
                        <Link
                          href={`${process.env.NEXT_PUBLIC_APP_URI}/${data.generated_link}`}
                        >
                          {process.env.NEXT_PUBLIC_APP_URI}/
                          {data.generated_link}
                        </Link>
                      </Typography>
                      <IconButton className={classes.inline}>
                        <FileCopyRoundedIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}></Grid>
                  </Grid>
                </Card>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </>
  );
}
