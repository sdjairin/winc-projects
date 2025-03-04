import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from "react-router-dom";
import SearchField from "./SearchField";
import "./EventList.css";

const EventList = ({ events, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchField, setSearchField] = useState("");

  //----------------------------------------------------
  // Map events to include category names
  const eventsWithCategoryNames = events.map((event) => {
    const categoryNames = event.categoryIds
      .filter((categoryIds) =>
        categories.some((category) => category.id === categoryIds)
      )
      .map((categoryIds) => {
        const category = categories.find(
          (category) => category.id === categoryIds
        );
        return category ? category.name : "Unknown";
      });

    return { ...event, categoryNames: categoryNames || [] };
  });

  // Filter events based on selected category
  const filteredEvents = selectedCategory
    ? eventsWithCategoryNames.filter((event) =>
        event.categoryIds.includes(selectedCategory)
      )
    : eventsWithCategoryNames;

  const formatEventDate = (startTime, endTime) => {
    const startDate = startTime.split("T")[0];
    const endDate = endTime.split("T")[0];
    return `from ${startDate} till ${endDate}`;
  };

  const formatEventTime = (startTime, endTime) => {
    const start = startTime.split("T")[1].split(":").slice(0, 2).join(":");
    const end = endTime.split("T")[1].split(":").slice(0, 2).join(":");
    return `${start} - ${end} `;
  };

  const matchedSearch = filteredEvents.filter((event) => {
    const query = searchField.toLowerCase();
    const titleMatch = event.title.toLowerCase().includes(query);
    const descriptionMatch = event.description.toLowerCase().includes(query);
    const dateMatch = formatEventDate(event.startTime, event.endTime).includes(
      query
    );
    const timeMatch = formatEventTime(event.startTime, event.endTime).includes(
      query
    );
    const categoryMatch = event.categoryNames.some((categoryName) =>
      categoryName.toLowerCase().includes(query)
    );
    return (
      titleMatch || descriptionMatch || dateMatch || timeMatch || categoryMatch
    );
  });

  //-------------------handle functions-------------------
  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  return (
    <Box w="80%" m="auto" className="event-list">
      <Heading mb="4" className="event-list-heading">
        List of events
      </Heading>

      <SearchField
        searchField={searchField}
        handleChange={handleChange}
        className="search-field"
      />
      <Flex mb="4" wrap="wrap" gap="2" className="menu-container">
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<TfiAngleDown />}
            className="menu-button"
          >
            {selectedCategory
              ? categories.find((cat) => cat.id === selectedCategory)?.name ||
                "Select category"
              : "Select category"}
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => setSelectedCategory("")}
              className="menu-item"
            >
              All
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="menu-item"
              >
                {category.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <Box className="event-cards">
        {matchedSearch.length > 0 ? (
          matchedSearch.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id}>
              <Card className="event-card">
                <Image src={event.image} alt={event.title} />
                <CardHeader>
                  <Text className="event-title">{event.title}</Text>
                </CardHeader>
                <CardBody>
                  <Text mb="2" className="event-description">
                    {event.description}
                  </Text>
                  <Text mb="2" className="event-date">
                    {formatEventDate(event.startTime, event.endTime)}
                  </Text>
                  <Text mb="2" className="event-time">
                    {formatEventTime(event.startTime, event.endTime)}
                  </Text>
                  <Stack direction="row" spacing={2}>
                    <Text className="event-category">Category:</Text>
                    {event.categoryNames.map((categoryName, index) => (
                      <Badge
                        key={index}
                        w="fit-content"
                        color="white"
                        bg="#e9762b"
                        p="1"
                        borderRadius="5"
                      >
                        {categoryName}
                      </Badge>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </Link>
          ))
        ) : (
          <Text>No events available</Text>
        )}
      </Box>
    </Box>
  );
};

export default EventList;
