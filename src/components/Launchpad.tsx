import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { wallpapers, launchpadApps } from "~/configs";
import { useAppSelector } from "~/redux/hooks";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
}

const placeholderText = "Search";

export default function Launchpad({ show, toggleLaunchpad }: LaunchpadProps) {
  const dark = useAppSelector((state) => state.system.dark);
  const [searchText, setSearchText] = useState("");

  const search = () => {
    if (searchText === "") return launchpadApps;
    const text = searchText.toLowerCase();
    const list = launchpadApps.filter((item) => {
      return (
        item.title.toLowerCase().includes(text) ||
        item.id.toLowerCase().includes(text)
      );
    });
    return list;
  };

  const close = show
    ? ""
    : "opacity-0 invisible transition-opacity duration-200";

  return (
    <div
      className={`${close} z-30 transform scale-110 w-full h-full fixed overflow-hidden bg-center bg-cover`}
      id="launchpad"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`
      }}
      onClick={() => toggleLaunchpad(false)}
    >
      <div className="w-full h-full absolute bg-gray-900 bg-opacity-20 backdrop-blur-2xl">
        <div
          className="mx-auto grid grid-cols-11 h-7 w-64 mt-5"
          bg="gray-200 opacity-10"
          border="1 rounded-md gray-200 opacity-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="col-start-1 col-span-1 flex-center">
            <BiSearch className="ml-1" color="white" />
          </div>
          <input
            className="col-start-2 col-span-10 no-outline bg-transparent px-1 text-sm text-white"
            placeholder={placeholderText}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div
          className="max-w-launchpad mx-auto mt-8 w-full px-4 sm:px-10"
          display="grid"
          grid="flow-row cols-4 sm:cols-7"
        >
          {search().map((app) => (
            <div
              key={`launchpad-${app.id}`}
              className="h-32 sm:h-36 w-full flex-center"
            >
              <div className="h-full w-full flex flex-col">
                <a
                  className="h-max"
                  href={app.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    className="w-14 sm:w-20 mx-auto"
                    src={app.img}
                    alt={app.title}
                    title={app.title}
                  />
                </a>
                <span className="mt-2 mx-auto text-white text-xs sm:text-sm">
                  {app.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
