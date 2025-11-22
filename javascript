const { readFilesToContextTool } = default_api;
const file_paths = [
  "src/pages/Landing.tsx",
  "index.html",
  "src/components/LogoDropdown.tsx"
];
await readFilesToContextTool({ file_paths, replace_files_in_context: false });
