import { useMotionValue } from "framer-motion";
import { apps } from "~/configs";
import { useAppSelector } from "~/redux/hooks";
import DockItem from "./DockItem";

interface DockProps {
  open: (id: string) => void;
  showApps: {
    [key: string]: boolean;
  };
  showLaunchpad: boolean;
  toggleLaunchpad: (target: boolean) => void;
  hide: boolean;
}

export default function Dock({
  open,
  showApps,
  showLaunchpad,
  toggleLaunchpad,
  hide
}: DockProps) {
  const { dockSize, dockMag } = useAppSelector((state) => ({
    dockSize: state.dock.size,
    dockMag: state.dock.mag
  }));

  const openApp = (id: string) => {
    if (id === "launchpad") toggleLaunchpad(!showLaunchpad);
    else {
      toggleLaunchpad(false);
      open(id);
    }
  };

  const mouseX = useMotionValue<number | null>(null);

  return (
    <div
      className={`dock w-full sm:w-max fixed left-0 right-0 mx-auto bottom-0 ${
        hide ? "z-0" : "z-50"
      } overflow-x-scroll sm:overflow-x-visible`}
    >
      <ul
        className="mx-auto w-max px-2 space-x-2 flex backdrop-blur-2xl"
        bg="white opacity-20 dark:(black opacity-20)"
        border="t l r rounded-none sm:rounded-t-lg gray-400 opacity-30 dark:(gray-500 opacity-30)"
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
        style={{
          height: `${(dockSize as number) + 15}px`
        }}
      >
        {apps.map((app) => (
          <DockItem
            key={`dock-${app.id}`}
            id={app.id}
            title={app.title}
            img={app.img}
            mouseX={mouseX}
            desktop={app.desktop}
            openApp={openApp}
            isOpen={app.desktop && showApps[app.id]}
            link={app.link}
            dockSize={dockSize as number}
            dockMag={dockMag as number}
          />
        ))}
      </ul>
    </div>
  );
}
