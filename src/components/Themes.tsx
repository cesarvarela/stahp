import React, { useEffect, useState } from "react";
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
  Heading,
} from "grommet";
import {
  Checkmark,
  DownloadOption,
  Search,
  StatusDisabled,
  Trash,
  View,
  Update,
} from "grommet-icons";
import { IThemePackage } from "../interfaces";

const {
  takeLongBreak,
  searchThemes,
  downloadTheme,
  getDownloadedThemes,
  deleteTheme,
} = window.stahp;

const Loading = () => (
  <Spinner
    size="small"
    animation={{
      type: "rotateRight",
      duration: 900,
    }}
  >
    <Update />
  </Spinner>
);

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
  };

  async function fetch() {
    const downloaded = await getDownloadedThemes();
    setDownloaded(downloaded);
  }

  const [downloaded, setDownloaded] = useState([]);

  useEffect(() => {
    fetch();
  }, [getDownloadedThemes]);

  const handleDelete = async (packg: IThemePackage) => {
    await deleteTheme(packg.name);

    const downloaded = await getDownloadedThemes();
    setDownloaded(downloaded);
  };

  const handleDownload = async (packg: IThemePackage) => {
    setResults((r: IThemePackage[]) =>
      r.map((r) =>
        r.name === packg.name ? { ...r, status: "downloading" } : r
      )
    );

    try {
      await downloadTheme(packg.name);

      setResults((r: IThemePackage[]) =>
        r.map((r) =>
          r.name === packg.name ? { ...r, status: "downloaded" } : r
        )
      );
    } catch (e) {
      setResults((r: IThemePackage[]) =>
        r.map((r) => (r.name === packg.name ? { ...r, status: "error" } : r))
      );
    }

    fetch();
  };

  const handleTest = async (packg: IThemePackage) => {
    takeLongBreak({ theme: packg.name });
  };

  return (
    <Box
      align="stretch"
      justify="center"
      direction="column"
      pad={{ top: "small" }}
    >
      <Heading level="2" size="small">
        Search themes
      </Heading>
      <Box
        pad="medium"
        round="small"
        background={{ color: "background-front" }}
        elevation="none"
      >
        <Box align="center" justify="start" direction="row" gap="small">
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
            size="small"
            primary
            onClick={() => handleSearch(query)}
          />
        </Box>
        <Box align="stretch" justify="center">
          {searching && (
            <Box
              align="center"
              justify="start"
              direction="row"
              gap="small"
              pad={{ top: "small" }}
            >
              <Text size="small">Searching</Text>
              <Loading />
            </Box>
          )}

          {results !== null && results.length > 0 && (
            <List
              data={results}
              pad={{ top: "small" }}
              primaryKey="name"
              secondaryKey="description"
            >
              {(datum: IThemePackage) => (
                <Box
                  align="center"
                  justify="between"
                  direction="row"
                  pad="xsmall"
                >
                  <Text>{datum.name}</Text>
                  <Box align="center" justify="center">
                    {
                      {
                        downloaded: (
                          <Box direction="row">
                            <Button
                              plain
                              label="Test"
                              icon={<View />}
                              margin={{ right: "medium" }}
                              onClick={() => handleTest(datum)}
                            />
                            <Checkmark />
                          </Box>
                        ),
                        available: (
                          <Button
                            plain
                            icon={<DownloadOption />}
                            onClick={() => handleDownload(datum)}
                          />
                        ),
                        downloading: <Loading />,
                        error: <StatusDisabled />,
                      }[datum.status]
                    }
                  </Box>
                </Box>
              )}
            </List>
          )}

          {results !== null && results.length === 0 && (
            <Box
              align="center"
              justify="start"
              direction="row"
              pad={{ top: "small" }}
            >
              <Text size="small" margin={{ right: "small" }}>
                No themes found for query: "{query}"
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
      </Box>

      <Heading size="small" level="3">
        Downloaded Themes
      </Heading>
      <Box
        align="stretch"
        justify="center"
        background={{ color: "background-front" }}
        pad="medium"
        round="small"
      >
        <List
          data={downloaded}
          primaryKey="name"
          secondaryKey="description"
          pad={{ top: "small" }}
        >
          {(datum: IThemePackage) => (
            <Box align="center" justify="between" direction="row" pad="xsmall">
              <Text>{datum.name}</Text>

              <Box align="center" justify="center" direction="row" gap="medium">
                <Button
                  label="Test"
                  size="small"
                  icon={<View />}
                  plain
                  onClick={() => handleTest(datum)}
                />
                <Button
                  plain
                  tip="holis"
                  style={{
                    opacity: datum.name == "stahp-theme-default" ? 0.5 : 1,
                  }}
                  disabled={datum.name == "stahp-theme-default"}
                  icon={<Trash />}
                  onClick={() => handleDelete(datum)}
                />
              </Box>
            </Box>
          )}
        </List>
      </Box>
      <Box
        align="center"
        justify="start"
        direction="row"
        margin={{ top: "medium" }}
        gap="small"
      >
        <Button
          secondary
          label="Open long break window in dev mode"
          onClick={() => takeLongBreak({ theme: "development" })}
        />
      </Box>
    </Box>
  );
}
