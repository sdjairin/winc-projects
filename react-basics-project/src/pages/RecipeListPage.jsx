import {
  Center,
  Heading,
  Card,
  CardBody,
  Image,
  Stack,
  Flex,
  Text,
  Badge,
  Input,
  Grid,
} from "@chakra-ui/react";
import { useState } from "react";
import { data } from "../utils/data";

export const RecipeListPage = ({ clickFn }) => {
  const [searchField, setSearchField] = useState("");

  const matchedRecipes = data.hits.filter((recipe) => {
    const query = searchField.toLowerCase();
    const nameMatch = recipe.recipe.label.toLowerCase().includes(query);
    const healthLabelMatch = recipe.recipe.healthLabels.some((label) =>
      label.toLowerCase().includes(query)
    );
    return nameMatch || healthLabelMatch;
  });

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  return (
    <>
      <Center h="300" flexDir="column">
        <Heading mb={8} size="2xl">
          Your Recipe App
        </Heading>
        <Input
          placeholder="Search for recipes"
          w="50%"
          h="70"
          borderRadius="xl"
          variant="filled"
          value={searchField}
          onChange={handleChange}
        />
      </Center>
      <Center
        h="100vh"
        w="100vw"
        flexDir="row"
        flexWrap="wrap"
        gap={8}
        justifyItems={["space-between"]}
      >
        {matchedRecipes.map((recipe) => (
          <Card
            key={recipe.recipe.label}
            w="sm"
            h="xl"
            borderRadius="xl"
            bg="gray.50"
          >
            <CardBody cursor="pointer" onClick={() => clickFn(recipe)}>
              <Image
                src={recipe.recipe.image}
                h={64}
                w="sm"
                borderRadius="xl"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md">{recipe.recipe.label}</Heading>
                <Flex gap="2">
                  {recipe.recipe.mealType.map((mealType) => (
                    <Text key={mealType}> {mealType}</Text>
                  ))}
                </Flex>
                <Flex gap="2">
                  {recipe.recipe.dishType.map((dishType) => (
                    <Text key={dishType}> {dishType}</Text>
                  ))}
                </Flex>
                <Flex gap="2" color="blue.500">
                  {recipe.recipe.dietLabels.map((dietLabel) => (
                    <Badge
                      key={dietLabel}
                      colorScheme="purple"
                      variant="subtle"
                    >
                      {" "}
                      {dietLabel}
                    </Badge>
                  ))}
                </Flex>
                <Flex gap="2">
                  {recipe.recipe.healthLabels.includes("Vegan") && (
                    <Badge colorScheme="green" variant="outline">
                      Vegan{" "}
                    </Badge>
                  )}
                  {recipe.recipe.healthLabels.includes("Vegetarian") && (
                    <Badge colorScheme="green" variant="outline">
                      Vegetarian{" "}
                    </Badge>
                  )}
                </Flex>
                {recipe.recipe.cautions.length > 0 && (
                  <Flex gap="2">
                    <Text>Cautions: </Text>
                    <Grid gap={2} templateColumns="repeat(2, 1fr)">
                      {recipe.recipe.cautions.map((caution) => (
                        <Badge key={caution} colorScheme="red" variant="subtle">
                          {caution}
                        </Badge>
                      ))}
                    </Grid>
                  </Flex>
                )}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Center>
    </>
  );
};
