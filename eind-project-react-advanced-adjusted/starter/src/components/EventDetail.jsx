import React, { useState } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Stack,
  Badge,
  Card,
  CardBody,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Heading,
  Avatar,
} from "@chakra-ui/react";
import { TfiAlarmClock, TfiCalendar } from "react-icons/tfi";
import "./EventDetail.css";

const EventDetail = ({ event, categories, users, onEdit, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editEvent, setEditEvent] = useState(event);
  const [newCategory, setNewCategory] = useState("");
  const [addedCategories, setAddedCategories] = useState([]);

  const categoryNames = editEvent.categoryIds.map((categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "Unknown";
  });

  const user = users.find((user) => user.id === event.createdBy);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setEditEvent((prevEvent) => {
      const categoryIds = prevEvent.categoryIds.includes(categoryId)
        ? prevEvent.categoryIds.filter((id) => id !== categoryId)
        : [...prevEvent.categoryIds, categoryId];
      return { ...prevEvent, categoryIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editEvent),
    });

    if (response.ok) {
      onClose();
      onEdit(editEvent);
    } else {
      console.error("Failed to update event");
    }
  };

  const formatEventDate = (startTime, endTime) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const startDate = new Date(startTime).toLocaleDateString("en-GB", options);
    const endDate = new Date(endTime).toLocaleDateString("en-GB", options);
    if (startDate === endDate) {
      return startDate;
    }
    return `${startDate} till ${endDate}`;
  };

  const formatEventTime = (startTime, endTime) => {
    const start = startTime.split("T")[1].split(":").slice(0, 2).join(":");
    const end = endTime.split("T")[1].split(":").slice(0, 2).join(":");
    return `${start} - ${end} `;
  };

  return (
    <Box p="4" className="event-detail">
      <Heading mb="4" className="event-detail-heading">
        {event.title}
      </Heading>
      <Box className="event-detail-content">
        <Card className="event-detail-card">
          <Image
            className="event-detail-img"
            src={event.image}
            alt={event.title}
          />
          <CardBody>
            <Text className="event-detail-description" mb="4">
              {event.description}
            </Text>
            <Text mb="4" className="event-detail-date">
              <TfiCalendar className="icon" />
              {formatEventDate(event.startTime, event.endTime)}
            </Text>
            <Text className="event-detail-time" mb="4">
              <TfiAlarmClock className="icon" />
              {formatEventTime(event.startTime, event.endTime)}
            </Text>

            <Stack className="event-detail-categories">
              <Text>Categories:</Text>
              {categoryNames.map((name, index) => (
                <Badge key={index} className="badge">
                  {name}
                </Badge>
              ))}
            </Stack>
            {user && (
              <Stack gap="4" direction="row" align="center" mt="4">
                <Avatar src={user.image} alt={user.name} />
                <Stack direction="row" wrap="wrap">
                  <Text>{user.name}</Text>
                </Stack>
              </Stack>
            )}
            <Flex mt="4" justify="space-between">
              <Button colorScheme="blue" onClick={onOpen}>
                Edit
              </Button>
              <Button colorScheme="red" onClick={onDelete}>
                Delete
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </Box>

      <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader color="#d91656">Edit Event</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb="4">
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={editEvent.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={editEvent.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={editEvent.image}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Start Time</FormLabel>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={editEvent.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>End Time</FormLabel>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={editEvent.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Categories</FormLabel>
                <Stack direction="row" wrap="wrap">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      colorScheme={
                        editEvent.categoryIds.includes(category.id)
                          ? "green"
                          : "gray"
                      }
                      onClick={() => handleCategoryToggle(category.id)}
                      m="1"
                    >
                      {category.name}
                    </Button>
                  ))}
                </Stack>
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Add New Category</FormLabel>
                <Stack mt="2">
                  {addedCategories.map((category) => (
                    <Badge key={category.id} colorScheme="green">
                      {category.name}
                    </Badge>
                  ))}
                </Stack>
                <Flex>
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button
                    ml="2"
                    bg="#d91656"
                    color="white"
                    _hover={{ bg: "#640d5f" }}
                    onClick={() => {
                      setAddedCategories([
                        ...addedCategories,
                        { id: addedCategories.length, name: newCategory },
                      ]);
                      setNewCategory("");
                    }}
                  >
                    Add
                  </Button>
                </Flex>
              </FormControl>
              <Button
                type="submit"
                bg="#d91656"
                color="white"
                mr="4"
                _hover={{ bg: "#640d5f" }}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default EventDetail;
