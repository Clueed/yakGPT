import { createStyles, rem, Title } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  title: {
    color:
      theme.colorScheme === "light" ? theme.white : theme.colors.primary[7],
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
    fontWeight: 900,
    display: "block",
    width: "100%",
    backgroundColor: theme.colors.blue[2],
    borderRadius: theme.radius.sm,
    padding: `${theme.spacing.sm} 0`,
    textAlign: "center",
  },
}));

export function YakTextLogo({ fontSize }: { fontSize: number | string }) {
  const { classes } = useStyles();
  return (
    <Title className={classes.title} fw={900} size={rem(fontSize)}>
      YakGPT
    </Title>
  );
}
