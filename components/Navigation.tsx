import { VStack, IconButton, Tooltip } from "@chakra-ui/react";
import { MdDashboard, MdSettings } from "react-icons/md";
import { BiLogOutCircle } from 'react-icons/bi';
import { HiLightningBolt, HiBell, HiTag, HiSearch } from "react-icons/hi";
import ChakraLogo from "./ChakraLogo";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Link from 'next/link'

const Navigation = () => {

  return (
    <VStack p={6} justifyContent="space-between" alignItems="center" w="full">
      <VStack>
        <ChakraLogo mb={6}/>
        <Tooltip label="Dashboard" placement="right">
          <IconButton
            color="gray.500"
            icon={<MdDashboard />}
            aria-label="Dashboard"
          />
        </Tooltip>
        <Tooltip label="Actions" placement="right">
          <IconButton
            color="gray.500"
            icon={<HiLightningBolt />}
            aria-label="Actions"
          />
        </Tooltip>
        <Tooltip label="Search" placement="right">
          <IconButton
            color="gray.500"
            icon={<HiSearch />}
            aria-label="Search"
          />
        </Tooltip>
        <Tooltip label="Notifications" placement="right">
          <IconButton
            color="gray.500"
            icon={<HiBell />}
            aria-label="Notifications"
          />
        </Tooltip>
        <Tooltip label="Tags" placement="right">
          <IconButton color="gray.500" icon={<HiTag />} aria-label="Tags" />
        </Tooltip>
        <Tooltip label="Log out" placement="right">
          <Link href="/login">
            <IconButton
              color="gray.500"
              icon={<BiLogOutCircle />}
              aria-label="Log out"
            />
          </Link>
        </Tooltip>
      </VStack>
      <Tooltip label="Settings" placement="right">
        <IconButton
          color="gray.500"
          icon={<MdSettings />}
          aria-label="Settings"
        />
      </Tooltip>
    </VStack>
  );
};

export default Navigation
