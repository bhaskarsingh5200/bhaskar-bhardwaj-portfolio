import { Wrench } from "lucide-react";
import * as api from "../../lib/admin-api.js";
import CrudSimple from "../CrudSimple.jsx";
import { ICON_OPTIONS } from "../icons.js";

const FIELDS = [
  { key: "title", label: "Title", type: "text", placeholder: "Business Websites" },
  { key: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Short description shown on the site." },
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

export default function ServicesAdmin() {
  return (
    <CrudSimple
      eyebrow="Content"
      title="Services"
      subtitle="Manage the services shown in the Services section."
      icon={Wrench}
      listFn={api.listServices}
      saveFn={api.saveService}
      deleteFn={api.deleteService}
      fields={FIELDS}
      newLabel="New Service"
      singularLabel="Service"
    />
  );
}
