import Chat from "../components/Chat";
import RoomProvider from "../context/RoomProvider";
import Main from "../layouts/Main";

const IndexPage = () => {
  return (
    <RoomProvider>
      <Main title="Your rooms">
        <Chat onChatHistoryOpen={() => {}} onChatFilesOpen={() => {}} />
      </Main>
    </RoomProvider>
  );
};  

export default IndexPage;
