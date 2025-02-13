import { Center, Heading, Input } from "@chakra-ui/react";

export const SearchField = ({ searchField, handleChange }) => {
  return (
    <Center h="300" flexDir="column">
      <Heading mb={8} size="2xl">
        Your Recipe App
      </Heading>
      <Input
        placeholder="Search for recipes"
        w={{ base: "90%", sm: "80%", md: "60%" }} // Adjust width for different screen sizes
        h="70"
        borderRadius="xl"
        variant="filled"
        value={searchField}
        onChange={handleChange}
      />
    </Center>
  );
};
