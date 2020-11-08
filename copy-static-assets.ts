import * as shell from "shelljs";

shell.mkdir("-p", "dist/public/");
shell.cp("-R", "src/public/css", "dist/public/");
shell.cp("-R", "src/public/js", "dist/public/");
shell.cp("src/public/favicon.ico", "dist/public/favicon.ico");
