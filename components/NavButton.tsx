import React, { useState, MouseEvent } from "react";
import {
  Burger,
  MediaQuery,
  Modal,
  Navbar,
  createStyles,
  getStylesRef,
  rem,
  useMantineColorScheme,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    //paddingBottom: theme.spacing.md,
    //marginBottom: `calc(${theme.spacing.md})`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    // im a noob
    flexGrow: "1 !important",

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
