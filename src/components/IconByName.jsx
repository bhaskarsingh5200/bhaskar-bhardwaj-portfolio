import {
  Atom,
  Braces,
  Code,
  Database,
  FileCode,
  GitBranch,
  Globe,
  HeartHandshake,
  Layers,
  Monitor,
  Palette,
  Search,
  Server,
  ShoppingBag,
  Smartphone,
  Terminal,
  Zap
} from "lucide-react";
import { FigmaIcon, GithubIcon } from "./BrandIcons.jsx";

const icons = {
  browser: Monitor,
  layers: Layers,
  bag: ShoppingBag,
  code: Code,
  responsive: Smartphone,
  bolt: Zap,
  search: Search,
  handshake: HeartHandshake,
  html: FileCode,
  css: Palette,
  javascript: Braces,
  react: Atom,
  wordpress: Globe,
  php: Terminal,
  mysql: Database,
  git: GitBranch,
  github: GithubIcon,
  figma: FigmaIcon,
  hostinger: Server
};

export default function IconByName({ name, size = 20, className = "" }) {
  const Icon = icons[name] || Code;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
