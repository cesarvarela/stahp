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
} from "grommet";
import {
  Checkmark,
  DownloadOption,
  Search,
  StatusDisabled,
  Trash,
} from "grommet-icons";
import { IThemePackage } from "../interfaces";

const {
  takeLongBreak,
  searchThemes,
  downloadTheme,
  getDownloadedThemes,
  deleteTheme,
} = window.stahp;

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
                          downloaded: <Checkmark />,
                          available: (
                            <Button
                              plain
                              icon={<DownloadOption />}
                              onClick={() => handleDownload(datum)}
                            />
                          ),
                          downloading: <Spinner />,
                          error: <StatusDisabled />,
                        }[datum.status]
                      }
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
            Downloaded Themes
          </Text>
        </CardHeader>
        <CardBody>
          <Box align="stretch" justify="center" margin={{ top: "small" }}>
            <List
              data={downloaded}
              pad="xsmall"
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
                          <Button
                            plain
                            icon={<Trash />}
                            onClick={() => handleDelete(datum)}
                          />
                        ),
                        available: null,
                        downloading: null,
                        error: null,
                      }[datum.status]
                    }
                  </Box>
                </Box>
              )}
            </List>
          </Box>
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
