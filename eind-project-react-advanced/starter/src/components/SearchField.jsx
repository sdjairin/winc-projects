import { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { TfiSearch } from "react-icons/tfi";
import "./SearchField.css"; // Import the CSS file

const SearchField = ({ events, NavigateToEvent, onSearch }) => {
  const [query, setQuery] = useState("");
  const toast = useToast();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }

    const matchedEvent = events.find((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedEvent) {
      NavigateToEvent(matchedEvent.id);
    } else {
      toast({
        title: "Event not found.",
        description: "No event matches your search query.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <InputGroup className="search-input-group">
      <Input
        className="search-input"
        placeholder="Search events"
        value={query}
        onChange={handleInputChange}
      />
      <InputRightElement>
        <Button className="search-button" onClick={handleSearch} size="md">
          <Icon fontSize="xl" alignSelf="center">
            <TfiSearch />
          </Icon>
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchField;
