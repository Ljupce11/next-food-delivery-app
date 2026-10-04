import { spawn } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const SOURCE_DIRS = ["src", "e2e"];
const ROOT_FILES = [
  "auth.ts",
  "auth-config.ts",
  "playwright.config.ts",
  "hero.ts",
  "next.config.ts",
];

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}

const files = [
  ...SOURCE_DIRS.flatMap((dir) => listFiles(path.join(root, dir))),
  ...ROOT_FILES.map((f) => path.join(root, f)),
];
const results = [];
const report = (file, line, col, source, severity, message) =>
  results.push({
    file: path.relative(root, file),
    line,
    col,
    source,
    severity,
    message: message.replace(/\s+/g, " ").trim(),
  });

function typescriptDiagnostics() {
  const configPath = ts.findConfigFile(
    root,
    ts.sys.fileExists,
    "tsconfig.json",
  );
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
  const service = ts.createLanguageService({
    getScriptFileNames: () => parsed.fileNames,
    getScriptVersion: () => "1",
    getScriptSnapshot: (f) =>
      ts.sys.fileExists(f)
        ? ts.ScriptSnapshot.fromString(ts.sys.readFile(f))
        : undefined,
    getCurrentDirectory: () => root,
    getCompilationSettings: () => parsed.options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  });
  const severity = (d) => {
    if (d.reportsDeprecated) return "deprecated";
    if (d.reportsUnnecessary) return "unused";
    return { 0: "warning", 1: "error", 2: "suggestion", 3: "message" }[
      d.category
    ];
  };
  for (const file of files.filter((f) => /\.tsx?$/.test(f))) {
    const all = [
      ...service.getSyntacticDiagnostics(file),
      ...service.getSemanticDiagnostics(file),
      ...service.getSuggestionDiagnostics(file),
    ];
    for (const d of all) {
      const { line, character } = d.file.getLineAndCharacterOfPosition(
        d.start ?? 0,
      );
      report(
        file,
        line + 1,
        character + 1,
        "typescript",
        severity(d),
        ts.flattenDiagnosticMessageText(d.messageText, " "),
      );
    }
  }
}

const TAILWIND_SETTINGS = {
  emmetCompletions: false,
  classAttributes: [
    "class",
    "className",
    "classNames",
    "ngClass",
    "class:list",
  ],
  classFunctions: ["tv", "cn", "clsx", "cva"],
  codeActions: false,
  codeLens: false,
  hovers: false,
  suggestions: false,
  validate: true,
  colorDecorators: false,
  rootFontSize: 16,
  lint: {
    cssConflict: "warning",
    invalidApply: "error",
    invalidScreen: "error",
    invalidVariant: "error",
    deprecatedAtRule: "warning",
    invalidConfigPath: "error",
    invalidTailwindDirective: "error",
    invalidSourceDirective: "error",
    recommendedVariantOrder: "warning",
    usedBlocklistedClass: "warning",
    suggestCanonicalClasses: "warning",
  },
  showPixelEquivalents: false,
  includeLanguages: {},
  files: { exclude: ["**/.git/**", "**/node_modules/**", "**/.next/**"] },
  experimental: { classRegex: [], configFile: null },
};

function tailwindDiagnostics() {
  return new Promise((resolve, reject) => {
    const server = spawn(
      path.join(root, "node_modules/.bin/tailwindcss-language-server"),
      ["--stdio"],
      { cwd: root },
    );
    let buffer = Buffer.alloc(0);
    let nextId = 1;
    let timeout;
    const pending = new Map();
    const diagnostics = new Map();

    const send = (message) => {
      const body = Buffer.from(JSON.stringify({ jsonrpc: "2.0", ...message }));
      server.stdin.write(
        Buffer.concat([
          Buffer.from(`Content-Length: ${body.length}\r\n\r\n`),
          body,
        ]),
      );
    };
    const request = (method, params) =>
      new Promise((res) => {
        const id = nextId++;
        pending.set(id, res);
        send({ id, method, params });
      });
    const finish = () => {
      clearTimeout(timeout);
      server.kill();
      for (const [uri, list] of diagnostics) {
        const file = new URL(uri).pathname;
        for (const d of list) {
          report(
            file,
            d.range.start.line + 1,
            d.range.start.character + 1,
            "tailwind",
            { 1: "error", 2: "warning", 3: "info", 4: "hint" }[d.severity] ??
              "warning",
            d.message,
          );
        }
      }
      resolve();
    };

    server.stdout.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (true) {
        const headerEnd = buffer.indexOf("\r\n\r\n");
        if (headerEnd === -1) return;
        const length = Number(
          /Content-Length: (\d+)/i.exec(
            buffer.subarray(0, headerEnd).toString(),
          )[1],
        );
        if (buffer.length < headerEnd + 4 + length) return;
        const message = JSON.parse(
          buffer.subarray(headerEnd + 4, headerEnd + 4 + length).toString(),
        );
        buffer = buffer.subarray(headerEnd + 4 + length);
        if (message.id !== undefined && message.method) {
          const result =
            message.method === "workspace/configuration"
              ? message.params.items.map((item) =>
                  item.section === "tailwindCSS"
                    ? TAILWIND_SETTINGS
                    : { tabSize: 2 },
                )
              : null;
          send({ id: message.id, result });
        } else if (message.id !== undefined && pending.has(message.id)) {
          pending.get(message.id)(message.result);
          pending.delete(message.id);
        } else if (message.method === "textDocument/publishDiagnostics") {
          diagnostics.set(message.params.uri, message.params.diagnostics);
        } else if (message.method === "@/tailwindCSS/serverReady") {
          finish();
        }
      }
    });
    server.on("error", reject);

    const rootUri = pathToFileURL(root).href;
    request("initialize", {
      processId: process.pid,
      rootUri,
      workspaceFolders: [{ uri: rootUri, name: path.basename(root) }],
      initializationOptions: { testMode: true },
      capabilities: {
        workspace: { configuration: true, workspaceFolders: true },
        textDocument: { publishDiagnostics: {} },
      },
    }).then(() => {
      send({ method: "initialized", params: {} });
      for (const file of files) {
        const languageId = file.endsWith(".css")
          ? "css"
          : file.endsWith(".tsx")
            ? "typescriptreact"
            : "typescript";
        send({
          method: "textDocument/didOpen",
          params: {
            textDocument: {
              uri: pathToFileURL(file).href,
              languageId,
              version: 1,
              text: readFileSync(file, "utf8"),
            },
          },
        });
      }
      timeout = setTimeout(
        () =>
          reject(
            new Error("Tailwind language server did not finish within 60s"),
          ),
        60_000,
      );
    });
  });
}

typescriptDiagnostics();
await tailwindDiagnostics();

const order = {
  error: 0,
  warning: 1,
  deprecated: 2,
  info: 3,
  suggestion: 4,
  unused: 5,
  hint: 6,
  message: 7,
};
results.sort(
  (a, b) =>
    order[a.severity] - order[b.severity] ||
    a.file.localeCompare(b.file) ||
    a.line - b.line,
);
for (const r of results)
  console.log(
    `${r.file}:${r.line}:${r.col}  ${r.source} ${r.severity}  ${r.message}`,
  );
const counts = Object.entries(
  Object.groupBy(results, (r) => `${r.source} ${r.severity}`),
).map(([k, v]) => `${v.length} ${k}`);
console.log(
  `\n${results.length} diagnostics${counts.length ? `: ${counts.join(", ")}` : ""}`,
);
const failing = new Set(["error", "warning", "deprecated", "unused"]);
process.exitCode = results.some((r) => failing.has(r.severity)) ? 1 : 0;
