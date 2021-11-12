import { Tooltip, Avatar, AvatarBadge } from "@chakra-ui/react";

type Props = {
  name: string;
  photoURL: string;
  isOnline: boolean;
};

const UserAvatar = ({ name, photoURL, isOnline }: Props) => {
  const avtProps = photoURL ? {
    src: photoURL
  } : {
    name: name
  }
  return (
    <Tooltip label={name}>
      <Avatar mt={1} {...avtProps}>
        {
          isOnline && <AvatarBadge boxSize={4} bg="green.500" />
        }
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
