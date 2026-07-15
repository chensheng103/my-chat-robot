export function runJavaScript(code) {
  const logs = [];
  let error = null;

  const mockConsole = {
    log: (...args) => logs.push({ type: "log", data: args }),
    warn: (...args) => logs.push({ type: "warn", data: args }),
    error: (...args) => logs.push({ type: "error", data: args })
  };

  // 禁止访问DOM、网络等危险全局API
  const forbiddenApi = {
    window: undefined,
    document: undefined,
    location: undefined,
    fetch: undefined
  };

  try {
    const execFunc = new Function("console", "window", "document", "location", "fetch", code);
    execFunc(mockConsole, forbiddenApi.window, forbiddenApi.document, forbiddenApi.location, forbiddenApi.fetch);
  } catch (err) {
    error = err.message;
  }

  return {
    logs,
    error
  };
}