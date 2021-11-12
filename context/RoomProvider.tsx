import { createContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";
import useFireStore from "../hooks/useFireStore";

type RoomContextState = {
  selectedRoom: {
    id: string;
    name: string;
    members: string[];
  };
};

export interface IProviderProps {
  children?: any;
}

const roomCtxDefaultValue = {
  state: {
    selectedRoom: {
      id: "",
      name: "",
      members: [],
    },
  },
  setState: (state: RoomContextState) => {},
  members: []
};

export const RoomContext = createContext(roomCtxDefaultValue);

function RoomProvider(props: IProviderProps) {
  const [state, setState] = useState(roomCtxDefaultValue.state);

  const usersCondition = useMemo(() => {
      return {
          fieldName: "uid",
          operator: "in",
          compareValue: state.selectedRoom.members,
      };
  }, [state.selectedRoom.members]);

  const members = useFireStore("users", usersCondition);

  return (
    <RoomContext.Provider
      value={{
        state,
        setState,
        members
      }}
    >
      {props.children}
    </RoomContext.Provider>
  );
}

export default RoomProvider;
