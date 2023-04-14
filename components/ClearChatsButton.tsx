import React, { useState, MouseEvent } from "react";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import NavButton from "./NavButton";
import { clearChats } from "@/stores/ChatActions";
interface Props {
  handleOnClick: () => void;
}

const ClearChatsButton: React.FC<Props> = ({ handleOnClick }) => {
  const [awaitingConfirmation, setAwaitingConfirmation] =
    useState<boolean>(false);

  const clickHandler = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (awaitingConfirmation) {
      handleOnClick();
      setAwaitingConfirmation(false);
    } else {
      setAwaitingConfirmation(true);
    }
  };

  const cancelConfirmation = () => {
    setAwaitingConfirmation(false);
  };

  return (
    <div onBlur={cancelConfirmation}>
      {awaitingConfirmation ? (
        <NavButton
          Icon={IconCheck}
          text="Confirm Clear Chats"
          handleOnClick={clickHandler}
        />
      ) : (
        <NavButton
          Icon={IconTrash}
          text="Clear Chats"
          handleOnClick={clickHandler}
        />
      )}
    </div>
  );
};

export default ClearChatsButton;
