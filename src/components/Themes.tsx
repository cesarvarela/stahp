import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Text,
  CardBody,
  CardFooter,
  Box,
  Button,
  TextInput,
  List,
  Spinner,
} from "grommet";
import { Download, DownloadOption, Search } from "grommet-icons";

const { takeLongBreak, searchThemes, downloadTheme } = window.stahp;

export default function Themes() {
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setQuery(query);
    setSearching(true);
    setResults(null);

    const results = await searchThemes(query);
    setResults(results);
    setSearching(false);

    console.log(results);
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (packg: any) => {
    setDownloading(true);

    const result = await downloadTheme(packg.name);

    setDownloading(false);

    console.log(result);
  };

  return (
    <Box
      align="stretch"
      justify="center"
      direction="column"
      pad={{ top: "small" }}
    >
      <Card pad="small">
        <CardHeader
          align="center"
          direction="row"
          flex={false}
          justify="between"
          gap="medium"
        >
          <Text weight="bold" size="small">
            Search themes
          </Text>
        </CardHeader>
        <CardBody>
          <Box align="center" justify="start" direction="row">
            <TextInput
              size="small"
              textAlign="start"
              type="text"
              plain={false}
              placeholder="Enter theme name"
              value={query}
              disabled={searching}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button
              icon={<Search />}
              disabled={searching}
              plain={false}
              margin="xsmall"
              size="small"
              primary
              onClick={() => handleSearch(query)}
            />
          </Box>
          <Box align="stretch" justify="center" margin={{ top: "small" }}>
            {searching && (
              <Box align="center" justify="start" direction="row">
                <Box align="center" justify="center" pad={{ right: "small" }}>
                  <Spinner />
                </Box>
                <Text size="small">Searching</Text>
              </Box>
            )}

            {results !== null && results.length > 0 && (
              <List
                data={results}
                pad="xsmall"
                primaryKey="name"
                secondaryKey="description"
              >
                {(datum: Record<string, unknown>) => (
                  <Box
                    align="center"
                    justify="between"
                    direction="row"
                    pad="xsmall"
                  >
                    <Text>{datum.name}</Text>
                    <Box align="center" justify="center">
                      <Button
                        plain
                        icon={<DownloadOption />}
                        onClick={() => handleDownload(datum)}
                      />
                    </Box>
                  </Box>
                )}
              </List>
            )}

            {results !== null && results.length === 0 && (
              <Box align="center" justify="start" direction="row">
                <Text size="small" margin={{ right: "small" }}>
                  No themes found for query: "{query},"
                </Text>{" "}
                <Text
                  size="small"
                  weight="bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSearch("")}
                >
                  search for all themes
                </Text>
              </Box>
            )}
          </Box>
        </CardBody>
        <CardFooter
          align="center"
          direction="row"
          flex={false}
          justify="between"
          gap="medium"
          pad="small"
        />
      </Card>

      <Card background={{ color: "background" }} margin={{ top: "small" }}>
        <CardHeader
          align="center"
          direction="row"
          flex={false}
          justify="between"
          gap="medium"
          pad="small"
        >
          <Text size="small" weight="bold">
            Available Themes
          </Text>
        </CardHeader>
        <CardBody pad="small" direction="row" align="center">
          stahp-theme-default
        </CardBody>
      </Card>
      <Box
        align="center"
        justify="start"
        direction="row"
        margin={{ top: "medium" }}
        gap="small"
      >
        <Button
          label="Open long break window in dev mode"
          onClick={() => takeLongBreak(true)}
        />
      </Box>
    </Box>
  );
}
