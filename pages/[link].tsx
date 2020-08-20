import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getOneLink } from "../helper/getOneLink";
import Error from "next/error";
import {
  Typography,
  Dialog,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import clsx from "clsx";
import { PasswordForm } from "../models/Form";
import { useForm } from "react-hook-form";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { getProtectedLink } from "../helper/getProtectedLink";

export const getServerSideProps = async (context) => {
  const { link } = context.params;
  return {
    props: {
      link: (await getOneLink(link))["data"] || null,
      token: link,
    },
  };
};

const useStyles = makeStyles((theme) => ({
  inputField: {
    backgroundColor: "#ffffff",
  },
  submitButton: {
    marginTop: "1rem",
    width: "100%",
  },
}));

const GlobalCss = withStyles({
  "@global": {
    ".MuiPaper-rounded": {
      padding: "1rem 2rem",
    },
    ".MuiFilledInput-adornedStart": {
      padding: 0,
    },
    ".MuiInputAdornment-positionEnd": {
      padding: 0,
      margin: "1rem 0 0 0",
    },
    ".MuiIconButton-edgeEnd": {
      margin: 0,
    },
  },
})(() => null);

export default function Link({ link, token }) {
  const router = useRouter();
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm<PasswordForm>();
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    data.token = token;
    const response = await getProtectedLink(data);
    if (response.status === 200) {
      window.location.replace(response.data["real_link"]);
    } else {
      setErrorMessage(response.message);
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setIsVisible(!isVisible);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!link.is_password) {
      window.location.replace(link["real_link"]);
    }
  }, []);
  if (router.isFallback) {
    return <div>Loading....</div>;
  }
  if (!link) {
    return <Error statusCode={404} />;
  }
  if (link.is_password) {
    return (
      <>
        <GlobalCss />
        <Dialog open={true}>
          <Typography variant="h6">Password</Typography>
          <Typography variant="body2">
            <b>{token}</b> is protected
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              className={clsx(classes.inputField)}
              variant="filled"
              margin="dense"
              type={isVisible ? "text" : "password"}
              name="password"
              inputRef={register({
                required: {
                  value: true,
                  message: "Password field is required",
                },
              })}
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
            <Typography color="error" variant="body2">
              {errorMessage || errors.password?.message}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress /> : "Submit"}
            </Button>
          </form>
        </Dialog>
      </>
    );
  } else {
    return <a href={link["real_link"]}>Redirecting to {link["real_link"]}</a>;
  }
}
