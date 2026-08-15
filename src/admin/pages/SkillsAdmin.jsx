import { Layers } from "lucide-react";
import * as api from "../../lib/admin-api.js";
import CrudSimple from "../CrudSimple.jsx";
import { CATEGORY_OPTIONS, ICON_OPTIONS } from "../icons.js";

const FIELDS = [
  { key: "name", label: "Name", type: "text", placeholder: "React" },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: CATEGORY_OPTIONS.map((value) => ({ value, label: value }))
  },
  {
    key: "icon",
    label: "Icon",
    type: "select",
    options: ICON_OPTIONS
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" }
    ]
  },
  { key: "sort_order", label: "Sort Order", type: "number", hint: "Lower numbers appear first" }
];

export default function SkillsAdmin() {
  return (
    <CrudSimple
      eyebrow="Content"
      title="Skills"
      subtitle="Manage the technologies shown in the Tech Stack section."
      icon={Layers}
      listFn={api.listSkills}
      saveFn={api.saveSkill}
      deleteFn={api.deleteSkill}
      fields={FIELDS}
      newLabel="New Skill"
      singularLabel="Skill"
    />
  );
}
