import {
  Center,
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Grid,
  GridItem,
  Box,
} from "@chakra-ui/react";

export const RecipePage = ({ recipe, clickFn }) => {
  return (
    <Center h="100vh" flexDir="column" p={4} position="relative">
      <Box position="absolute" top={4} left={4}>
        <Button w="fit-content" onClick={() => clickFn()}>
          Back to overview
        </Button>
      </Box>
      <Card
        borderRadius="xl"
        w={{ base: "90%", sm: "80%", md: "3xl" }}
        h="auto"
        overflowY="auto"
      >
        <CardBody>
          <Image
            h="auto"
            w="100%"
            borderRadius="xl"
            src={recipe.recipe.image}
            mb={4}
          />
          <Grid
            templateColumns={{ base: "1fr", sm: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
          >
            <GridItem>
              <Text color="gray.500" paddingTop="2">
                {recipe.recipe.mealType}
              </Text>
              <Heading size="md">{recipe.recipe.label}</Heading>
              <Text>Total Cooking Time: {recipe.recipe.totalTime} minutes</Text>
              <Text>Servings: {recipe.recipe.yield}</Text>
              <Heading size="sm" paddingY="2">
                Ingredients:
              </Heading>
              {recipe.recipe.ingredientLines.map((ingredient, index) => (
                <Text key={index}>{ingredient}</Text>
              ))}
            </GridItem>
            <GridItem>
              <Heading size="sm" paddingY="2">
                Health Labels:
              </Heading>
              <Flex gap="2" flexWrap="wrap">
                {recipe.recipe.healthLabels.map((healthLabel) => (
                  <Badge
                    key={healthLabel}
                    colorScheme="purple"
                    variant="subtle"
                  >
                    {healthLabel}
                  </Badge>
                ))}
              </Flex>
              <Heading size="sm" paddingY="2">
                Diet:
              </Heading>
              <Flex gap="2" flexWrap="wrap">
                {recipe.recipe.dietLabels.map((dietLabel) => (
                  <Badge key={dietLabel} colorScheme="green" variant="subtle">
                    {dietLabel}
                  </Badge>
                ))}
              </Flex>
              <Heading size="sm" paddingY="2">
                Cautions:
              </Heading>
              {recipe.recipe.cautions.length > 0 && (
                <Flex gap="2" flexWrap="wrap">
                  {recipe.recipe.cautions.map((caution) => (
                    <Badge key={caution} colorScheme="red" variant="subtle">
                      {caution}
                    </Badge>
                  ))}
                </Flex>
              )}
              <Heading size="sm" paddingY="2">
                Total Nutrients:
              </Heading>
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={3}
                w="fit-content"
                alignContent="center"
              >
                <Flex direction="column" alignContent="center">
                  {recipe.recipe.totalNutrients.ENERC_KCAL.quantity.toFixed(0)}
                  <Text size="sm">kcal</Text>
                </Flex>
                <Flex direction="column" alignContent="center">
                  {recipe.recipe.totalNutrients.PROCNT.quantity.toFixed(0)} g
                  <Text>Protein</Text>
                </Flex>
                <Flex direction="column" alignContent="center">
                  {recipe.recipe.totalNutrients.FAT.quantity.toFixed(0)} g
                  <Text>Fat</Text>
                </Flex>
                <Flex direction="column" alignContent="center">
                  {recipe.recipe.totalNutrients.CHOCDF.quantity.toFixed(0)} g
                  <Text>Carbs</Text>
                </Flex>
                <Flex direction="column" alignContent="center">
                  {recipe.recipe.totalNutrients.CHOLE.quantity.toFixed(0)} mg
                  <Text>Cholesterol</Text>
                </Flex>
                <Flex direction="column" alignContent="center">
                  {recipe.recipe.totalNutrients.NA.quantity.toFixed(0)} mg
                  <Text>Sodium</Text>
                </Flex>
              </Grid>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Center>
  );
};
