import { FaPaw, FaVuejs, FaRobot } from "react-icons/fa";
import {
  GiNinjaHeroicStance,
  GiJumpingDog,
  GiEnergySword,
  GiCat,
  GiFishEscape
} from "react-icons/gi";
import { VscGithub } from "react-icons/vsc";
import { GoRepo, GoBrowser } from "react-icons/go";
import { RiGamepadLine, RiNewspaperFill } from "react-icons/ri";
import { HiFire } from "react-icons/hi";
import { CgFormatText } from "react-icons/cg";
import { BiCube, BiGame } from "react-icons/bi";
import { BsFillImageFill, BsGrid1X2 } from "react-icons/bs";
import { AiFillAudio,AiFillVideoCamera } from "react-icons/ai";

import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: <FaPaw />,
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: <GiNinjaHeroicStance />,
        excerpt: "Hey there! I'm Ritesh Yadav..."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: <VscGithub />,
        excerpt: "Here are some status about my github account..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: <GoBrowser />,
        excerpt: "Something about this personal portfolio site..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: <GoRepo />,
    md: [
      {
        id: "Video Captioning",
        title: "Video Captioning",
        file: "https://raw.githubusercontent.com/DARK-art108/README-Projects/main/captioning.md",
        icon: <AiFillVideoCamera />,
        excerpt: "Generating Caption from Videos using LSTM...",
        link: "https://github.com/DARK-art108/Vedio-Captioning-Using-LSTM"
      },
      {
        id: "MegatronBot",
        title: "MegatronBot",
        file: "https://raw.githubusercontent.com/DARK-art108/README-Projects/main/megatron.md",
        icon: <FaRobot />,
        excerpt: "MegatronBot is a Full-Fledged ChatBot with some awesome Powers🔥...",
        link: "https://github.com/DARK-art108/MegatronBot"
      },
      {
        id: "DetectNow.ai",
        title: "DetectNow.ai",
        file: "https://raw.githubusercontent.com/DARK-art108/README-Projects/main/dash.md",
        icon: <AiFillVideoCamera/>,
        excerpt: "A Video Analytics Dashboard for detecting and tracking objects",
        link: "https://github.com/DARK-art108/YoloV5-DeepSort-Streamlit-Dashboard"
      }

    ]
  }
];

export default bear;
