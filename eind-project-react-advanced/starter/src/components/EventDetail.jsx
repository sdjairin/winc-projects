import React, { useEffect, useState } from "react";
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
import { TfiAlarmClock, TfiCalendar, TfiMapAlt } from "react-icons/tfi";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./EventDetail.css";

const EventDetail = ({
  event,
  categories,
  users,
  onEdit,
  setUsers,
  setCategories,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editEvent, setEditEvent] = useState(event);
  const [newCategory, setNewCategory] = useState("");
  const [addedCategories, setAddedCategories] = useState([]);
  const [createdByName, setCreatedByName] = useState("");
  const [createdByImage, setCreatedByImage] = useState("");

  const allCategories = [...categories, ...addedCategories];

  const categoryNames = editEvent.categoryIds.map((categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "Unknown";
  });

  const user = users.find((user) => user.id === event.createdBy);

  useEffect(() => {
    if (user) {
      setCreatedByName(user.name);
      setCreatedByImage(user.image);
    }
  }, [user]);

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

  //----------------------input fields handler----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  //----------------------category toggle handler----------------------
  const handleCategoryToggle = (categoryId) => {
    setEditEvent((prevEvent) => {
      const categoryIds = prevEvent.categoryIds.includes(categoryId)
        ? prevEvent.categoryIds.filter((id) => id !== categoryId)
        : [...prevEvent.categoryIds, categoryId];
      return { ...prevEvent, categoryIds };
    });
  };

  //----------------------add category handler----------------------
  const handleAddCategory = async () => {
    const existingCategory = categories.find(
      (category) => category.name.toLowerCase() === newCategory.toLowerCase()
    );

    if (existingCategory) {
      setEditEvent((prevEvent) => ({
        ...prevEvent,
        categoryIds: [...prevEvent.categoryIds, existingCategory.id],
      }));
      setAddedCategories((prevCategories) => [
        ...prevCategories,
        existingCategory,
      ]);
    } else {
      const response = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        const newCategoryData = await response.json();
        setAddedCategories((prevCategories) => [
          ...prevCategories,
          newCategoryData,
        ]);
        setCategories((prevCategories) => [...prevCategories, newCategoryData]); // Update categories state
        setEditEvent((prevEvent) => ({
          ...prevEvent,
          categoryIds: [...prevEvent.categoryIds, newCategoryData.id],
        }));
      } else {
        console.error("Failed to add category");
      }
    }

    setNewCategory("");
  };

  //----------------------submit handler----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingUser = users.find(
      (user) => user.name.toLowerCase() === createdByName.toLowerCase()
    );
    if (existingUser) {
      setEditEvent((prevEvent) => ({
        ...prevEvent,
        createdBy: existingUser.id,
      }));
      if (existingUser.image !== createdByImage) {
        try {
          const response = await fetch(
            `http://localhost:3000/users/${existingUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ image: createdByImage }),
            }
          );

          if (response.ok) {
            const updatedUser = await response.json();
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            );
          }
        } catch (error) {
          console.error("Failed to update user");
        }
      }
    } else {
      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: createdByName }),
        });

        if (response.ok) {
          const newUser = await response.json();
          setUsers((prevUsers) => [...prevUsers, newUser]);
          setEditEvent((prevEvent) => ({
            ...prevEvent,
            createdBy: newUser.id,
          }));
        }
      } catch (error) {
        console.error("Failed to add user");
      }
    }

    try {
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
      }
    } catch (error) {
      console.error("Failed to update event");
    }
  };

  const handleDrawerClose = () => {
    setNewCategory("");
    setAddedCategories([]);
    onClose();
  };

  return (
    <Box p="4" className="event-detail">
      <Button as={Link} to={"/"} className="back-button">
        Back
      </Button>
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
            <Text className="event-detail-description">
              {event.description}
            </Text>
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              justify="flex-start"
              align="center"
            >
              <Text className="event-detail-date">
                <TfiCalendar className="icon" />
                {formatEventDate(event.startTime, event.endTime)}
              </Text>
              <Text className="event-detail-time">
                <TfiAlarmClock className="icon" />
                {formatEventTime(event.startTime, event.endTime)}
              </Text>
            </Flex>
            <Text
              className="event-detail-location"
              flexDirection={{ base: "column", md: "row" }}
            >
              <TfiMapAlt className="icon" /> {event.location}
            </Text>
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              justify="space-between"
            >
              <Stack
                className="event-detail-categories"
                align={{ base: "center", sm: "left", md: "left" }}
              >
                <Text
                  className="categories-header"
                  align={{ base: "center", sm: "left", md: "left" }}
                >
                  Categories:
                </Text>
                <Stack className="categories-list">
                  {categoryNames.map((name, index) => (
                    <Badge key={index} className="badge" align="center">
                      {name}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
              {user && (
                <Stack
                  className="user-details"
                  gap="4"
                  direction="column"
                  alignItems="center"
                  mt="4"
                >
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    size={{ base: "md", sm: "lg", md: "lg" }}
                  />
                  <Stack direction="row" wrap="wrap">
                    <Text fontSize="md">{user.name}</Text>
                  </Stack>
                </Stack>
              )}
            </Flex>
            <Flex
              mt="4"
              justify="space-between"
              className="event-detail-buttons"
            >
              <Button className="edit-button" onClick={onOpen}>
                <RiEdit2Line />
              </Button>
              <Button className="delete-button" onClick={onDelete}>
                <RiDeleteBin6Line />
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </Box>

      <Drawer isOpen={isOpen} placement="top" onClose={handleDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader color="#d91656" display="flex" justifyContent="center">
            Edit Event
            <Flex position="absolute" right="4" top="4">
              <Button
                type="submit"
                bg="#d91656"
                color="white"
                mr="4"
                _hover={{ bg: "#640d5f" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Flex>
            <Flex position="absolute" left="4" top="4">
              <Button onClick={handleDrawerClose}>Cancel</Button>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb="4">
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  name="title"
                  value={editEvent.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Input
                  id="description"
                  name="description"
                  value={editEvent.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="image">Image URL</FormLabel>
                <Input
                  id="image"
                  name="image"
                  value={editEvent.image}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="startTime">Start Time</FormLabel>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={editEvent.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="endTime">End Time</FormLabel>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={editEvent.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="categories">Categories</FormLabel>
                <Stack direction="row" wrap="wrap">
                  {allCategories.map((category) => (
                    <Button
                      id="categories"
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
                <FormLabel htmlFor="newCategory">Add New Category</FormLabel>
                <Stack mt="2">
                  {addedCategories.map((category) => (
                    <Badge
                      key={category.id}
                      colorScheme="green"
                      w="fit-content"
                      p="2"
                      mb="2"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </Stack>
                <Flex>
                  <Input
                    id="newCategory"
                    name="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button
                    ml="2"
                    bg="#d91656"
                    color="white"
                    _hover={{ bg: "#640d5f" }}
                    onClick={handleAddCategory}
                  >
                    Add
                  </Button>
                </Flex>
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="createdBy">Created By</FormLabel>
                <Input
                  id="createdBy"
                  name="createdBy"
                  value={createdByName}
                  onChange={(e) => setCreatedByName(e.target.value)}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="createdByImage">
                  Creator Image URL
                </FormLabel>
                <Input
                  id="createdByImage"
                  name="createdByImage"
                  value={createdByImage}
                  onChange={(e) => setCreatedByImage(e.target.value)}
                />
              </FormControl>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default EventDetail;
