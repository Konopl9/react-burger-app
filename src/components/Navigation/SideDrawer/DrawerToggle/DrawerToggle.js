import React from "react";

import classes from "./DrawerToggle.module.css"

const drawerToggle = (props) => (
    <div className={classes.DrawerToggle} onClick={props.clicked}>
      {/*LOL 1 div equals 1 live in toggle button :) */}
      <div></div>
      <div></div>
      <div></div>
      </div>
);

export default drawerToggle;