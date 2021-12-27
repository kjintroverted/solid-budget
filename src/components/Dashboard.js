import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { HeaderBar, Spacer } from "solid-core/dist/components/styled";
import { THEME } from "../App";

const Dashboard = ({ user, data }) => {
  return (
    <HeaderBar theme={ THEME }>
      <h2>My Budget</h2>
      <Spacer />
      <Link to="/profile">
        <IconButton color="inherit"><span className="material-icons">person</span></IconButton>
      </Link>
    </HeaderBar>
  )
}

export default Dashboard;