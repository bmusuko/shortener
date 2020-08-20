import Head from "next/head";
import {
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
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useState } from "react";
import { createShortener } from "../helper/createShortener";
import { ShortenerForm } from "../models/Form";
import { useToasts, ToastProvider } from "react-toast-notifications";
import copy from "copy-to-clipboard";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
const buttonWidth = 100;

const GlobalCss = withStyles({
  "@global": {
    ".MuiFilledInput-root": {
      backgroundColor: "#ffffff",
    },
  },
})(() => null);

const useStyles = makeStyles((theme) => ({
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
  link: {
    [theme.breakpoints.up("sm")]: {
      paddingRight: "1rem",
    },
  },
  password: {
    [theme.breakpoints.up("sm")]: {
      paddingLeft: "1rem",
    },
  },
}));

function HomeWithToast() {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm<ShortenerForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const { addToast } = useToasts();
  const getGeneratedLink = (): string => {
    return `${process.env.NEXT_PUBLIC_APP_URI}/${data.generated_link}`;
  };
  const onSubmit = async (data: ShortenerForm) => {
    try {
      setData(null);
      setIsLoading(true);
      const response = await createShortener(data);
      setData(response.data);
      if (response.status !== 200) {
        addToast(response.message, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        setValue("URL", "");
        setValue("custom", "");
        setValue("password", "");
      }
      setIsLoading(false);
    } catch (e) {
      // for some reason not working
      setIsLoading(false);
      addToast(e.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const handleCopy = () => {
    copy(getGeneratedLink());
    addToast("Copied to Clipboard!", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const handleClickShowPassword = () => {
    setIsVisible(!isVisible);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
              {Boolean(errors.URL) && (
                <Typography color="error">{errors.URL.message}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.link}>
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
                error={Boolean(errors.custom)}
              />
              {Boolean(errors.custom) && (
                <Typography color="error">{errors.custom.message}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.password}>
              <TextField
                label="Password (Optional)"
                InputLabelProps={{ shrink: true }}
                fullWidth
                className={clsx(classes.inputField)}
                variant="filled"
                margin="dense"
                type={isVisible ? "text" : "password"}
                name="password"
                inputRef={register({})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isVisible ? (
                          <Visibility fontSize="small" />
                        ) : (
                          <VisibilityOff fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(errors.password)}
              />
              {Boolean(errors.password) && (
                <Typography color="error">{errors.password.message}</Typography>
              )}
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
                  {/* <Grid item xs={12}>
                      <Typography variant="body1">{data.real_link}</Typography>
                    </Grid> */}
                  <Grid item xs={12}>
                    <Typography className={classes.inline} variant="body1">
                      <Link href={`${getGeneratedLink()}`}>
                        {getGeneratedLink()}
                      </Link>
                    </Typography>
                    <IconButton className={classes.inline} onClick={handleCopy}>
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
    </>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeWithToast />
    </ToastProvider>
  );
}
