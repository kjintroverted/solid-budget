import React from "react";
import { ProviderLogin } from "@inrupt/solid-react-components";

const Login = () => {
  return (
    <ProviderLogin
      onError={console.error}
      callbackUri={`${window.location.origin}`}
    />
  );
};

export default Login;
