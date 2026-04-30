import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconName } from "@fortawesome/fontawesome-svg-core";
import { CSSProperties } from "react";
import {
  // ── Public ──────────────────────────────
  faArrowRight,
  faArrowLeft,
  faChevronRight,
  // ── Admin ───────────────────────────────
  faTrash,
  faPlus,
  faCheck,
  faRightFromBracket, // logout
  faBars,             // menu
  faFloppyDisk,       // save
  faEye,
  faHouse,
  faLayerGroup,
  faFolder,
  faScrewdriverWrench,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faArrowRight,
  faArrowLeft,
  faChevronRight,
  faTrash,
  faPlus,
  faCheck,
  faRightFromBracket,
  faBars,
  faFloppyDisk,
  faEye,
  faHouse,
  faLayerGroup,
  faFolder,
  faScrewdriverWrench,
  faGear,
);

export default function Icon({
  name,
  size,
  color,
  style,
  className,
}: {
  name: IconName;
  size?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <FontAwesomeIcon
      icon={["fas", name]}
      style={{ fontSize: size, color, ...style }}
      className={className}
    />
  );
}