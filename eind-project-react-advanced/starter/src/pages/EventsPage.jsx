import React from "react";
import { Box } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import EventList from "../components/EventList";

export const loader = async () => {
  try {
    const eventsResponse = await fetch("http://localhost:3000/events");
    const categoriesResponse = await fetch("http://localhost:3000/categories");

    const events = await eventsResponse.json();
    const categories = await categoriesResponse.json();

    return { events, categories };
  } catch (error) {
    console.error("Failed to fetch events or categories", error);
    throw new Error("Failed to fetch events or categories");
  }
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();

  return (
    <Box bg="white" p={4} h="100vh">
      <EventList events={events} categories={categories} />
    </Box>
  );
};
