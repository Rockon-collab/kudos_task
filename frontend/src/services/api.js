import { ApiCaller, NonAuthApiCaller } from "../utils/apiCaller";

export const SignUp = ({
  firstName,
  lastName,
  email,
  organization,
  password,
  password2,
}) =>
  NonAuthApiCaller(
    `api/signup/`,
    "POST",
    {
      first_name: firstName,
      last_name: lastName,
      email,
      organization,
      password,
      password2,
    },
    process.env.REACT_APP_URL
  );

  export const Login = ({ email, password }) => {
    return NonAuthApiCaller(
      `api/login/`,
      "POST",
      {
        email,
        password,
      },
      process.env.REACT_APP_URL
    );
  };

export const Organizations = () =>
  NonAuthApiCaller(`api/organizations/`, "GET", {}, process.env.REACT_APP_URL);

export const ReceivedKudosList = () =>
  ApiCaller(`api/kudos-list/`, "GET", {}, process.env.REACT_APP_URL);

export const SentKudosList = () =>
  ApiCaller(`api/kudos/sent`, "GET", {}, process.env.REACT_APP_URL);

export const UsersList = () =>
  ApiCaller(`api/users`, "GET", {}, process.env.REACT_APP_URL);

export const GiveKudos = ({ email, message }) =>
  ApiCaller(
    `api/give-kudos/`,
    "POST",
    {
      receiver: email,
      message,
    },
    process.env.REACT_APP_URL
  );

export const DashboardSummary = () =>
  ApiCaller(`api/summary`, "GET", {}, process.env.REACT_APP_URL);

export const LogoutToken = (refresh) =>
  ApiCaller(
    `api/logout/`,
    "POST",
    {
      refresh,
    },
    process.env.REACT_APP_URL
  );
