import {
  VStack,
  Avatar,
  AvatarBadge,
  Heading,
  HStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { RiDribbbleLine, RiInstagramLine, RiTwitterFill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import { BiLogOut, BiBell } from "react-icons/bi";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { db, storage } from "../firebase/config";

type Props = {
  uid: string;
  name: string;
  photoURL?: string;
  isOnline: boolean;
};

const UserMainAvatar = ({ uid }: Props) => {
  const { handleSignout } = useContext(AuthContext);

  const inputFileRef = useRef(null);

  const handleChangeAvatar = () => {
    inputFileRef.current.click();
  };

  const [avtProps, setAvtProps] = useState({});
  const [isOnline, setisOnline] = useState(true);
  const [name, setName] = useState("");


  useEffect(() => {
    if (uid) {
      db.collection("users").where("uid", "==", uid).get().then(snap => {
        const user = snap.docs[0].data();
        let props = user.photoURL ? { src: user.photoURL } : { name: user.displayName };
        setAvtProps(props)
        setName(user.displayName)
      });
    }
  }, [])

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const uploadTask = storage.ref(`avatars/${image.name}`).put(image);

      uploadTask.on(
        "stage_changed",
        snapshot => {},
        error => {
          console.log(error)
        },
        async () => {
          const url = await storage
            .ref("avatars")
            .child(image.name)
            .getDownloadURL()
          const snap = await db.collection("users").where("uid", "==", uid).get();
          snap.docs[0].ref.update({
            photoURL: url
          })
          setAvtProps({ src: url })
        }
      )
    }
  };

  return (
    <>
      <Avatar mt={1} {...avtProps} size="2xl">
        {isOnline && <AvatarBadge boxSize={8} bg="green.500" borderWidth={4} />}
      </Avatar>
      <VStack>
        <Heading size="md" mt={{ base: 0, lg: 3 }}>
          {name}
        </Heading>
        <HStack px={8} justifyContent="center" spacing={3} mt={6}>
          <Tooltip label="Notifications">
            <IconButton
              icon={<BiBell />}
              variant="ghost"
              rounded="full"
              color="gray.500"
              h={10}
              aria-label="Dribble Account"
            />
          </Tooltip>
          <input
                accept="image/*"
                ref={inputFileRef}
                name="icon-button-file"
                type="file"
                hidden={true}
                onChange={handleChange}
              />
          <Tooltip label="Change avatar">
              
              <IconButton
                onClick={() => {
                  handleChangeAvatar();
                }}
                icon={<RiInstagramLine />}
                variant="ghost"
                rounded="full"
                color="gray.500"
                h={10}
                aria-label="Instagram Account"
              />
          </Tooltip>
          <Tooltip label="Log out">
            <IconButton
              onClick={() => {
                handleSignout();
              }}
              icon={<BiLogOut />}
              variant="ghost"
              rounded="full"
              color="gray.500"
              h={10}
              aria-label="Log out"
            />
          </Tooltip>
        </HStack>
      </VStack>
    </>
  );
};

export default UserMainAvatar;
