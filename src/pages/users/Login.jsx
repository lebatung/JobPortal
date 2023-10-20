import LoginForm from "./Form/LoginForm";

import { useNavigate } from "react-router-dom"
import { Button } from "antd";

const Login = ({updateIsAuthenticated}) => {
  
  const navigate = useNavigate();
  const handleGoToHome = () => {
    
    navigate("/");
  };

  const pageContainer = {
    background: "linear-gradient(to right, #800080, #4B0082)",
    width: "100%",
    height: "100vh",
  };

  const registerFormContainer = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "700px",
    height: "auto",
    display: "block",
    zIndex: "1002",
    background: "#fff",
    padding: "20px",
    margin: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  };
  const pDiv ={
    textAlign: "center",
    paddingTop: "10px",
    margin: "-5px",
  };

  const buttonStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
  };
  
  return (
    <div style={pageContainer}>
      <Button style={buttonStyle} onClick={handleGoToHome} type="primary">
        Chuyển đến trang chủ
      </Button>
      <div style={registerFormContainer}>
        <h2 style={pDiv}>Đăng nhập</h2>
        <LoginForm />
        
      </div>
    </div>
  );
};

export default Login;
