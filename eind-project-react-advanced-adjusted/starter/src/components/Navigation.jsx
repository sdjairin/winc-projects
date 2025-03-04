import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Button,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  FormControl,
  FormLabel,
  useDisclosure,
  Input,
  Badge,
  Stack,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useMediaQuery,
  Icon,
} from "@chakra-ui/react";
import { TfiHome, TfiPlus, TfiMenu } from "react-icons/tfi";
import "./Navigation.css";

export const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [addedCategories, setAddedCategories] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    image: "",
    categoryIds: [],
  });
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    };

    const fetchEvents = async () => {
      const response = await fetch("http://localhost:3000/events");
      const data = await response.json();
      setFilteredEvents(data);
    };
    fetchCategories();
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = async () => {
    const existingCategory = categories.find(
      (category) => category.name.toLowerCase() === newCategory.toLowerCase()
    );

    if (existingCategory) {
      setNewEvent((prevEvent) => ({
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
        setCategories((prevCategories) => [...prevCategories, newCategoryData]);
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          categoryIds: [...prevEvent.categoryIds, newCategoryData.id],
        }));
        setAddedCategories((prevCategories) => [
          ...prevCategories,
          newCategoryData,
        ]);
      } else {
        console.error("Failed to add category");
      }
    }

    setNewCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      const newEventData = await response.json();
      setFilteredEvents((prevEvents) => [...prevEvents, newEventData]);
      onClose();
      navigate("/");
    } else {
      console.error("Failed to add event");
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const isEventPage = location.pathname.startsWith("/event");

  return (
    <>
      <Flex
        className="nav"
        justify={isEventPage ? "space-between" : "flex-end"}
        align="center"
      >
        {isEventPage && (
          <Button as={Link} to={"/"} className="back-button">
            Back
          </Button>
        )}
        {isLargerThan768 ? (
          <Button
            className="nav-button"
            onClick={onDrawerOpen}
            leftIcon={<TfiMenu />}
            fontSize={"2xl"}
          >
            Menu
          </Button>
        ) : (
          <Button className="nav-button" onClick={onDrawerOpen}>
            <Icon fontSize="2xl">
              <TfiMenu />
            </Icon>
          </Button>
        )}
      </Flex>

      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={onDrawerClose}
        size={isSmallerThan768 ? "full" : "md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="drawer-header">Menu</DrawerHeader>

          <DrawerBody>
            <Flex direction="column" w="100%" className="drawer">
              <Box mb="4">
                <Button
                  as={Link}
                  to="/"
                  leftIcon={<TfiHome />}
                  onClick={onDrawerClose}
                  className="drawer-button"
                >
                  Home
                </Button>
              </Box>
              <Box mb="4">
                <Button
                  onClick={onOpen}
                  leftIcon={<TfiPlus />}
                  className="drawer-button"
                >
                  Add Event
                </Button>
              </Box>
              {!isEventPage && (
                <Box mb="4" className="accordion">
                  <Accordion allowToggle>
                    <AccordionItem border="none">
                      <AccordionButton className="accordion-button">
                        <Box flex="1" textAlign="left">
                          Events <AccordionIcon />
                        </Box>
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Accordion allowToggle>
                          {filteredEvents.map((event) => (
                            <AccordionItem key={event.id} border="none">
                              <AccordionButton className="lv2-accordion-button">
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  onClick={() => handleEventClick(event.id)}
                                >
                                  {event.title}
                                </Box>
                              </AccordionButton>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size={isSmallerThan768 ? "full" : "md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add New Event</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb="4">
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={newEvent.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={newEvent.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={newEvent.image}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Start Time</FormLabel>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={newEvent.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>End Time</FormLabel>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={newEvent.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Created By</FormLabel>
                <Input
                  name="createdBy"
                  value={newEvent.createdBy}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="4">
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
                    onChange={handleNewCategoryChange}
                    placeholder="New category name"
                    mb="4"
                  />
                  <Button
                    ml="2"
                    onClick={handleAddCategory}
                    bg="#d91656"
                    color="white"
                    _hover={{ bg: "#640D5F" }}
                  >
                    Add
                  </Button>
                </Flex>
              </FormControl>

              <Button
                type="submit"
                to="/"
                mr="4"
                bg="#d91656"
                color="white"
                _hover={{ bg: "#640D5F" }}
              >
                Submit
              </Button>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
