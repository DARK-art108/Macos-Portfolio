import React, { useRef, useState, useEffect } from "react";
import type { RefObject } from "react";
import format from "date-fns/format";
import { BiSearch } from "react-icons/bi";
import { apps, launchpadApps } from "~/configs";
import { useClickOutside } from "~/hooks";
import type { LaunchpadData, AppsData } from "~/types";

const allApps: { [key: string]: (LaunchpadData | AppsData)[] } = {
  app: apps,
  portfolio: launchpadApps
};

const getRandom = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (): string => {
  const timeStamp = new Date().getTime();
  const randomStamp = getRandom(0, timeStamp);
  const date = format(randomStamp, "MM/dd/yyyy");
  return date;
};

interface SpotlightProps {
  toggleSpotlight: () => void;
  openApp: (id: string) => void;
  toggleLaunchpad: (target: boolean) => void;
  btnRef: RefObject<HTMLDivElement>;
}

export default function Spotlight({
  toggleSpotlight,
  openApp,
  toggleLaunchpad,
  btnRef
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [clickedID, setClickedID] = useState("");
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");
  const [curDetails, setCurDetails] = useState<any>(null);

  const [appIdList, setAppIdList] = useState<string[]>([]);
  const [appList, setAppList] = useState<JSX.Element | null>(null);

  const textWhite = "text-white dark:text-black";
  const textBlack = "text-black dark:text-white";
  const textSelected = "bg-blue-500 dark:bg-blue-400";

  useClickOutside(spotlightRef, toggleSpotlight, [btnRef]);

  useEffect(() => {
    updateAppList();
  }, [searchText]);

  useEffect(() => {
    updateCurrentDetails();
  }, [selectedIndex]);

  useEffect(() => {
    if (appIdList.length === 0) return;
    // find app's index given its id
    const newSelectedIndex = appIdList.findIndex((item) => {
      return item === clickedID;
    });
    // update index
    updateHighlight(selectedIndex, newSelectedIndex);
    setSelectedIndex(newSelectedIndex);
  }, [clickedID]);

  useEffect(() => {
    if (doubleClicked) {
      launchSelectedApp();
      setDoubleClicked(false);
    }
  }, [doubleClicked]);

  const search = (type: string) => {
    if (searchText === "") return [];
    const text = searchText.toLowerCase();
    const list = allApps[type].filter((item: LaunchpadData | AppsData) => {
      return (
        item.title.toLowerCase().includes(text) ||
        item.id.toLowerCase().includes(text)
      );
    });
    return list;
  };

  const handleClick = (id: string): void => {
    setClickedID(id);
  };

  const handleDoubleClick = (id: string): void => {
    setClickedID(id);
    setDoubleClicked(true);
  };

  const launchSelectedApp = (): void => {
    if (curDetails.type === "app" && !curDetails.link) {
      const id = curDetails.id;
      if (id === "launchpad") toggleLaunchpad(true);
      else openApp(id);
      toggleSpotlight();
    } else {
      window.open(curDetails.link);
      toggleSpotlight();
    }
  };

  const getTypeAppList = (type: string, startIndex: number) => {
    const result = search(type);
    const typeAppList = [];
    const typeAppIdList = [];

    for (const app of result) {
      const curIndex = startIndex + typeAppList.length;
      const bg = curIndex === 0 ? textSelected : "bg-transparent";
      const text = curIndex === 0 ? textWhite : textBlack;

      if (curIndex === 0) setCurrentDetailsWithType(app, type);

      typeAppList.push(
        <li
          id={`spotlight-${app.id}`}
          key={`spotlight-${app.id}`}
          className={`pl-4 h-7 w-full pr-1 flex flex-row ${bg} ${text} cursor-default`}
          data-app-type={type}
          onClick={() => handleClick(app.id)}
          onDoubleClick={() => handleDoubleClick(app.id)}
        >
          <div className="flex-none w-8 flex-center-v">
            <img
              className="w-5 mx-auto"
              src={app.img}
              alt={app.title}
              title={app.title}
            />
          </div>
          <div className="flex-grow flex-center-v pl-3 overflow-hidden whitespace-nowrap">
            {app.title}
          </div>
        </li>
      );
      typeAppIdList.push(app.id);
    }

    return {
      appList: typeAppList,
      appIdList: typeAppIdList
    };
  };

  const updateAppList = (): void => {
    const app = getTypeAppList("app", 0);
    const portfolio = getTypeAppList("portfolio", app.appIdList.length);

    const newAppIdList = [...app.appIdList, ...portfolio.appIdList];
    // don't show app details when there is no associating app
    if (newAppIdList.length === 0) setCurDetails(null);

    const newAppList = (
      <div>
        {app.appList.length !== 0 && (
          <div>
            <div className="spotlight-type">Applications</div>
            <ul className="w-full text-xs">{app.appList}</ul>
          </div>
        )}
        {portfolio.appList.length !== 0 && (
          <div>
            <div className="spotlight-type">Portfolio</div>
            <ul className="w-full text-xs">{portfolio.appList}</ul>
          </div>
        )}
      </div>
    );

    setAppIdList(newAppIdList);
    setAppList(newAppList);
  };

  const setCurrentDetailsWithType = (app: any, type: string): void => {
    const details = app;
    details.type = type;
    setCurDetails(details);
  };

  const updateCurrentDetails = (): void => {
    if (appIdList.length === 0 || searchText === "") {
      setCurDetails(null);
      return;
    }

    const appId = appIdList[selectedIndex];
    const elem = document.querySelector(`#spotlight-${appId}`) as HTMLElement;
    const id = appId;
    const type = elem.dataset.appType as string;
    const app = allApps[type].find((item: LaunchpadData | AppsData) => {
      return item.id === id;
    });
    setCurrentDetailsWithType(app, type);
  };

  const updateHighlight = (prevIndex: number, curIndex: number): void => {
    if (appIdList.length === 0) return;

    // remove highlight
    const prevAppId = appIdList[prevIndex];
    const prev = document.querySelector(
      `#spotlight-${prevAppId}`
    ) as HTMLElement;
    let classes = prev.className;
    classes = classes.replace(textWhite, textBlack);
    classes = classes.replace(textSelected, "bg-transparent");
    prev.className = classes;

    // add highlight
    const curAppId = appIdList[curIndex];
    const cur = document.querySelector(`#spotlight-${curAppId}`) as HTMLElement;
    classes = cur.className;
    classes = classes.replace(textBlack, textWhite);
    classes = classes.replace("bg-transparent", textSelected);
    cur.className = classes;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const keyCode = e.key;
    const numApps = appIdList.length;

    // ----------- select next app -----------
    if (keyCode === "ArrowDown" && selectedIndex < numApps - 1) {
      updateHighlight(selectedIndex, selectedIndex + 1);
      setSelectedIndex(selectedIndex + 1);
    }
    // ----------- select previous app -----------
    else if (keyCode === "ArrowUp" && selectedIndex > 0) {
      updateHighlight(selectedIndex, selectedIndex - 1);
      setSelectedIndex(selectedIndex - 1);
    }
    // ----------- launch app -----------
    else if (keyCode === "Enter") {
      if (!curDetails) return;
      launchSelectedApp();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // update highlighted line
    updateHighlight(selectedIndex, 0);
    // current selected id go back to 0
    setSelectedIndex(0);
    // update search text and associating app list
    setSearchText(e.target.value);
  };

  const focusOnInput = (): void => {
    const input = document.querySelector("#spotlight-input") as HTMLElement;
    input.focus();
  };

  return (
    <div
      className="spotlight"
      onKeyDown={handleKeyPress}
      onClick={focusOnInput}
      ref={spotlightRef}
    >
      <div className="w-full grid grid-cols-8 sm:grid-cols-11 h-12 sm:h-14 rounded-md bg-transparent">
        <div className="col-start-1 col-span-1 flex-center">
          <BiSearch
            className="ml-1 text-gray-600 dark:text-gray-300"
            size={28}
          />
        </div>
        <input
          id="spotlight-input"
          className="col-start-2 col-span-7 sm:col-span-10 bg-transparent no-outline px-1"
          text="xl sm:2xl black dark:white"
          placeholder="Spotlight Search"
          value={searchText}
          onChange={handleInputChange}
          autoFocus={true}
        />
      </div>
      {searchText !== "" && (
        <div className="h-spotlight bg-transparent flex flex-row border-t menu-box-border">
          <div className="flex-none w-32 sm:w-72 border-r menu-box-border overflow-y-scroll">
            {appList}
          </div>
          <div className="flex-grow">
            {curDetails && (
              <div className="h-full w-full flex flex-col">
                <div
                  className="mx-auto w-4/5 h-56 border-b menu-box-border"
                  flex="none center col"
                >
                  <img
                    className="w-32 mx-auto"
                    src={curDetails.img}
                    alt={curDetails.title}
                    title={curDetails.title}
                  />
                  <div className="mt-4 text-xl text-black dark:text-white">
                    {curDetails.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {`Version: ${getRandom(0, 99)}.${getRandom(0, 999)}`}
                  </div>
                </div>
                <div className="flex-grow flex text-xs">
                  <div
                    className="w-1/2 items-end"
                    flex="none center-h col"
                    text="gray-500 dark:gray-400"
                  >
                    <div>Kind</div>
                    <div>Size</div>
                    <div>Created</div>
                    <div>Modified</div>
                    <div>Last opened</div>
                  </div>
                  <div
                    className="pl-2 text-black dark:text-white"
                    flex="grow center-h col"
                  >
                    <div>
                      {curDetails.type === "app" ? "Application" : "Portfolio"}
                    </div>
                    <div>{`${getRandom(0, 999)} G`}</div>
                    <div>{getRandomDate()}</div>
                    <div>{getRandomDate()}</div>
                    <div>{getRandomDate()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
