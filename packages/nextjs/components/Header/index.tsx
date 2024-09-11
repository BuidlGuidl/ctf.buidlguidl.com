import { HeaderClient } from "./HeaderClient";
import { HeaderMenuLinks } from "./HeaderMenuLinks";

export const Header = () => {
  return <HeaderClient menuLinks={<HeaderMenuLinks />} />;
};
