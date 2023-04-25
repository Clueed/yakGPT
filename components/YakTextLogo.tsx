import { createStyles, rem, Title } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export function YakTextLogo({ fontSize }: { fontSize: number }) {
  const { classes } = useStyles();
  return (
    <Title className={classes.title} size={rem(fontSize)}>
      <span className={classes.highlight}>YakGPT</span>
    </Title>
  );
}
