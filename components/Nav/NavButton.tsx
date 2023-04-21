import React, { useState, MouseEvent } from "react";
import {
  Burger,
  Button,
  MediaQuery,
  Modal,
  Navbar,
  createStyles,
  getStylesRef,
  rem,
  useMantineColorScheme,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
    height: "20px",
    width: "20px",
    [theme.fn.smallerThan("sm")]: {
      height: "25px",
      width: "25px",
    },
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
    },
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },
}));

export default function NavButton({
  Icon,
  handleOnClick = (event) => {},
  text,
}) {
  const { classes, cx, theme } = useStyles();

  const IconComponent = Icon;

  return (
    <a href="#" className={classes.link} onClick={handleOnClick}>
      <IconComponent className={classes.linkIcon} stroke={1.5} />
      <span>{text}</span>
    </a>
  );
}
