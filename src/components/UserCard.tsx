import {
  Box,
  Flex,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import React, { useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
type Hexathon = {
  id: string;
  name: string;
};
type Props = {
  user: any;
};


// TODO: right now, the UserCard only displays the user's name and email. Create a new modal component <UserModal> that
// pops up when the card is clicked. In this modal, list all the user's information including name, email, phoneNumber,
// and userId. 

// TODO: Explore if you can display the email as a link to the user's email that will open up the user's 
// email client and start a new email to that user. Also explore if you can provide a link to the user's resume.

// TODO: In our database structure, every user has a userId that is unique to them. This is the primary key of the user
// and is referenced in their applications to all of our hexathons. Create a button that when clicked, will retrieve all of
// the hexathons that the user has applied to. You can use the /applications endpoint of the registration service to do this
// and the /hexathons endpoint of the hexathons service to get a list of all the hexathons.

const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hexathons, setHexathons] = useState<Hexathon[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserHexathons = async () => {
    setLoading(true);
    try {
      // get the user's applications
      const applicationsUrl = apiUrl(Service.REGISTRATION, '/applications');
      const applicationsResponse = await axios.get(applicationsUrl, {
        params: {
          userId: props.user.userId,
        },
      });

      // getting hexathon IDs from applications
      const hexathonIds = applicationsResponse.data.data.applications.map(
        (app: any) => app.hexathonId
      );

      // Then, get hexathon details for each application
      const hexathonsUrl = apiUrl(Service.HEXATHONS, '/hexathons');
      const hexathonsResponse = await axios.get(hexathonsUrl);
      
      // Filter hexathons to only include ones user applied to
      const userHexathons = hexathonsResponse.data.data.hexathons.filter(
        (hex: Hexathon) => hexathonIds.includes(hex.id)
      );

      setHexathons(userHexathons);
    } catch (error) {
      console.error('Error fetching hexathons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box
    borderWidth="1px"
    rounded="lg"
    boxShadow="lg"
    height="175px"
    fontWeight="bold"
    alignItems="center"
    >
      <Flex padding="2" flexDirection="column">
        <HStack align="flex-end" justify="space-between">
          <Text fontSize='xl'>{`${props.user.name.first} ${props.user.name.last}`}</Text>
        </HStack>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          justifyContent="justify"
          mt="2"
        >
          {props.user.email}
        </Text>
      </Flex>
    </Box>

    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{`${props.user.name.first} ${props.user.name.last}`}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack align="start" spacing={3} pb={4}>
          <Text><strong>Name:</strong> {`${props.user.name.first} ${props.user.name.last}`}</Text>
          <Text><strong>Email:</strong> {props.user.email}</Text>
          <Text><strong>Phone Number:</strong> {props.user.phoneNumber || 'N/A'}</Text>
          <Text><strong>User ID:</strong> {props.user.userId}</Text>
        </VStack>
      </ModalBody>
    </ModalContent>
    </Modal>
    </>
  );
};

export default UserCard;