import { useState } from "react";
import {
  Box,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import EventDetail from "../components/EventDetail";

export const loader = async ({ params }) => {
  const eventResponse = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const usersResponse = await fetch("http://localhost:3000/users");

  if (!eventResponse.ok || !categoriesResponse.ok || !usersResponse.ok) {
    throw new Error("Failed to fetch events or categories");
  }

  const event = await eventResponse.json();
  const categories = await categoriesResponse.json();
  const users = await usersResponse.json();

  return { event, categories, users };
};

export const EventPage = () => {
  const { event, categories, users } = useLoaderData();
  const [currentEvent, setCurrentEvent] = useState(event);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (updatedEvent) => {
    setCurrentEvent(updatedEvent);
    toast({
      title: "Event updated",
      description: "The event was successfully updated",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast({
        title: "Event deleted",
        description: "The event was successfully deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } else {
      toast({
        title: "Failed to delete event",
        description: "There was an error while deleting the event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = () => {
    onOpen();
  };

  return (
    <Box>
      <EventDetail
        event={currentEvent}
        categories={categories}
        users={users}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this event?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDelete} mr="4">
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
