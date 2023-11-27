import React from "react";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({authenticated, component: Component}) => {
  return (
    authenticated 
    ? Component 
    : <>{alert('로그인이 필요합니다.')}<Navigate to="/login"/></>
  );
}

export default PrivateRoute;