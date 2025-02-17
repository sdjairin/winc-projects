import React from "react";
import { Box } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import EventList from "../components/EventList";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");

  if (!eventsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch events or categories");
  }

  const events = await eventsResponse.json();
  const categories = await categoriesResponse.json();

  return { events, categories };
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();

  return (
    <Box>
      <EventList events={events} categories={categories} />
    </Box>
  );
};
